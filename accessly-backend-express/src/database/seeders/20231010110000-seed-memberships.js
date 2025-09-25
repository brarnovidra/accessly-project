export async function up(queryInterface, Sequelize) {
  // Mengecek apakah ada data memberships dengan type A, B, C
  const [existingMemberships] = await queryInterface.sequelize.query(
    'SELECT COUNT(*) AS count FROM `memberships` WHERE type IN (:types)',
    {
      replacements: { types: ['A', 'B', 'C'] },
      type: Sequelize.QueryTypes.SELECT,
    }
  );

  // Jika data sudah ada, melewatkan seeding
  if (existingMemberships.count > 0) {
    console.log('Data sudah ada, melewatkan seeding...');
    return;
  }

  // Jika data belum ada, insert ke dalam tabel memberships
  await queryInterface.bulkInsert('memberships', [
    {
      type: 'A',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      type: 'B',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      type: 'C',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  console.log('Data memberships berhasil ditambahkan.');
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('memberships', null, {});
}
