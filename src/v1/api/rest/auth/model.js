const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const { SequelizeClient } = require("../../../client");

const { BCRYPT_SALT_SIZE } = process.env;

const sequelize = SequelizeClient.getInstance();

/** Define Sequelize Model */
const Role = sequelize.define(
  "Role",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "name",
    },
  },
  {
    tableName: "roles",
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "username",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password",
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "first_name",
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "last_name",
    },
    birthDay: {
      type: DataTypes.DATE,
      field: "birth_day",
    },
    gender: {
      type: DataTypes.BOOLEAN,
      field: "gender",
      defaultValue: false,
    },
    email: {
      type: DataTypes.STRING,
      field: "email",
      allowNull: false,
    },
    tel: {
      type: DataTypes.STRING,
      field: "tel",
      unique: true,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      field: "image_url",
    },
    fingerprint: {
      type: DataTypes.STRING,
      field: "fingerprint",
      allowNull: false,
    },
    activated: {
      type: DataTypes.BOOLEAN,
      field: "activated",
      defaultValue: false,
    },
    confirmCode: {
      type: DataTypes.STRING,
      field: "confirm_code",
      allowNull: false,
    },
  },
  {
    tableName: "users",
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

const UserVerifySignature = sequelize.define(
  "VerifySignature",
  {
    accessSignature: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "access_signature",
    },
    accessSignatureExpiredAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "access_signature_expired_at",
    },
    refreshSignature: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "refresh_signature",
    },
    refreshSignatureExpiredAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "refresh_signature_expired_at",
    },
  },
  {
    tableName: "user_verify_signature",
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

/** Define Sequelize Model Associations */
Role.belongsToMany(User, { through: "role_user", foreignKey: "role_id" });
User.belongsToMany(Role, { through: "role_user", foreignKey: "user_id" });

User.hasMany(UserVerifySignature, { foreignKey: "user_id" });
UserVerifySignature.belongsTo(User, { foreignKey: "user_id" });

/**
 * User.hasOne(UserBlackList, { foreignKey: "user_id" });
 * UserBlackList.belongsTo(User, { foreignKey: "user_id" });
 */

/** Define Hook */
User.addHook("beforeCreate", "hashedPassword", async (value, options) => {
  const hashedPassword = await bcrypt.hash(value.password, await bcrypt.genSalt(parseInt(BCRYPT_SALT_SIZE)));
  value.password = hashedPassword;
});

User.addHook("beforeBulkCreate", "hashedPassword", async (values, options) => {
  await Promise.all(
    values.map(async (v, i, o) => {
      const hashedPassword = await bcrypt.hash(v.password, await bcrypt.genSalt(parseInt(BCRYPT_SALT_SIZE)));
      v.password = hashedPassword;
    })
  );
});

User.addHook("beforeUpdate", "hashedPassword", async (value, options) => {
  const isHashedPassword = value.password.match(/^\$2[ayb]\$.{56}$/);
  if (!isHashedPassword) {
    const hashedPassword = await bcrypt.hash(value.password, await bcrypt.genSalt(parseInt(BCRYPT_SALT_SIZE)));
    value.password = hashedPassword;
  }
  value.confirmCode = uuidv4();
});

module.exports = { Role, User, UserVerifySignature };
