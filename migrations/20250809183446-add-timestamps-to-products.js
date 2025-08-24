module.exports = {
  async up(db, client) {
    await db.collection('products').updateMany(
      {},
      {
        $set: {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    );
  },

  async down(db, client) {
    await db.collection('products').updateMany(
      {},
      {
        $unset: {
          createdAt: '',
          updatedAt: '',
        },
      },
    );
  },
};
