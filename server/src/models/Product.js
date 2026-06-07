import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    category: {
      type: String,
      enum: ["indoor", "outdoor", "succulents", "pots", "tools", "seeds", "accessories"],
      required: true,
    },
    images: [{ type: String }],
    stock: { type: Number, default: 0, min: 0 },
    light: { type: String, enum: ["low", "medium", "bright", "direct"], default: "medium" },
    careLevel: { type: String, enum: ["easy", "medium", "expert"], default: "easy" },
    petSafe: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.pre("validate", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model("Product", productSchema);
