const User = require("./userModel");
const Property = require("./propertyModel");
const PropertyImage = require("./propertyImageModel");
const Amenity = require("./amenityModel");
const Favorite = require("./favoriteModel");
const Enquiry = require("./enquiryModel");

/*
    User → Property
    One User can publish many Properties.
*/
User.hasMany(Property, {
  foreignKey: "userId",
  as: "properties",
});

Property.belongsTo(User, {
  foreignKey: "userId",
  as: "owner",
});

/*
    Property → PropertyImage
    One Property can have many Images.
*/
Property.hasMany(PropertyImage, {
  foreignKey: "propertyId",
  as: "images",
  onDelete: "CASCADE",
});

PropertyImage.belongsTo(Property, {
  foreignKey: "propertyId",
  as: "property",
});

/*
    Property ↔ Amenity (Many-to-Many)
*/
Property.belongsToMany(Amenity, {
  through: "property_amenities",
  foreignKey: "propertyId",
  otherKey: "amenityId",
  as: "amenities",
});

Amenity.belongsToMany(Property, {
  through: "property_amenities",
  foreignKey: "amenityId",
  otherKey: "propertyId",
  as: "properties",
});

/*
    Property → Enquiry
    One Property can have many Enquiries.
*/
Property.hasMany(Enquiry, {
  foreignKey: "propertyId",
  as: "enquiries",
});

Enquiry.belongsTo(Property, {
  foreignKey: "propertyId",
  as: "property",
});

/*
    User → Enquiry
    One User can submit many Enquiries.
*/
User.hasMany(Enquiry, {
  foreignKey: "userId",
  as: "enquiries",
});

Enquiry.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

/*
    Favorites (User ↔ Property)
*/
User.hasMany(Favorite, {
  foreignKey: "userId",
  as: "favorites",
});

Favorite.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Property.hasMany(Favorite, {
  foreignKey: "propertyId",
  as: "favorites",
});

Favorite.belongsTo(Property, {
  foreignKey: "propertyId",
  as: "property",
});

module.exports = {
  User,
  Property,
  PropertyImage,
  Amenity,
  Favorite,
  Enquiry,
};
