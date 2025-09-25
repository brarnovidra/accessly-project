export async function up(queryInterface, Sequelize) {
  const contents = [];
  const contentsMembership = [];

  // Mengambil membership_id yang valid
  const [memberships] = await queryInterface.sequelize.query(
    'SELECT id FROM `memberships` WHERE id IN (1, 2, 3)'
  );

  // Memastikan data membership_id yang diperlukan sudah ada
  if (memberships.length !== 3) {
    console.log("Memberships dengan id 1, 2, 3 tidak ditemukan. Seeder dibatalkan.");
    return;
  }

  // Mengecek apakah sudah ada data di tabel 'content_memberships' untuk mencegah duplikasi
  const [existingMembershipContents] = await queryInterface.sequelize.query(
    'SELECT COUNT(*) AS count FROM `content_memberships` WHERE membership_id IN (1, 2, 3)'
  );

  if (existingMembershipContents[0].count > 0) {
    console.log("Relasi antara membership dan content sudah ada, melewatkan seeding...");
    return;
  }

  // Membuat konten hanya 20 artikel dan 20 video
  const totalArticles = 10;
  const totalVideos = 10;

  // Membuat artikel
  for (let i = 1; i <= totalArticles; i++) {
    contents.push({
      title: `Article ${i}`,
      body: `This is article number ${i}.`,
      type: "article",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Membuat video
  for (let i = 1; i <= totalVideos; i++) {
    contents.push({
      title: `Video ${i}`,
      body: `This is video number ${i}.`,
      type: "video",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Memasukkan konten ke tabel 'contents'
  await queryInterface.bulkInsert("contents", contents, {});

  // Mengambil id content yang baru dimasukkan
  const [contentsFromDb] = await queryInterface.sequelize.query(
    'SELECT id, title, type FROM `contents` WHERE type IN ("article", "video") ORDER BY id'
  );

  // Membagi konten berdasarkan membership

  // Membership A (hanya bisa mengakses 3 artikel dan 3 video)
  const membershipAArticles = contentsFromDb.filter(content => content.type === "article").slice(0, 3); 
  const membershipAVideos = contentsFromDb.filter(content => content.type === "video").slice(0, 3);

  // Menambahkan relasi untuk Membership A
  membershipAArticles.forEach((content) => {
    contentsMembership.push({
      membership_id: 1,
      content_id: content.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
  membershipAVideos.forEach((content) => {
    contentsMembership.push({
      membership_id: 1,
      content_id: content.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  // Membership B (hanya bisa mengakses 10 artikel dan 10 video)
  const membershipBArticles = contentsFromDb.filter(content => content.type === "article").slice(0, 10);
  const membershipBVideos = contentsFromDb.filter(content => content.type === "video").slice(0, 10); 

  // Menambahkan relasi untuk Membership B
  membershipBArticles.forEach((content) => {
    contentsMembership.push({
      membership_id: 2,
      content_id: content.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
  membershipBVideos.forEach((content) => {
    contentsMembership.push({
      membership_id: 2,
      content_id: content.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  // Membership C (bisa mengakses seluruh konten, 20 artikel dan 20 video)
  const membershipCArticles = contentsFromDb.filter(content => content.type === "article"); 
  const membershipCVideos = contentsFromDb.filter(content => content.type === "video"); 

  // Menambahkan relasi untuk Membership C
  membershipCArticles.forEach((content) => {
    contentsMembership.push({
      membership_id: 3,
      content_id: content.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
  membershipCVideos.forEach((content) => {
    contentsMembership.push({
      membership_id: 3,
      content_id: content.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  // Memasukkan relasi many-to-many ke tabel pivot
  await queryInterface.bulkInsert('content_memberships', contentsMembership, {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('content_memberships', null, {});
  await queryInterface.bulkDelete('contents', null, {});
}
