import { z } from "zod";

export type Vec2 = z.infer<typeof Vec2Schema>;
export type Vec3 = z.infer<typeof Vec3Schema>;
export type Vec4 = z.infer<typeof Vec4Schema>;
export type Mat4 = z.infer<typeof Mat4Schema>;
export type RGB = z.infer<typeof RGBSchema>;
export type PrimitiveBase = z.infer<typeof PrimitiveBaseSchema>;
export type ShapePrimitive = z.infer<typeof ShapePrimitiveSchema>;
export type MeshPrimitive = z.infer<typeof MeshPrimitiveSchema>;
export type _Primitive = z.infer<typeof PrimitiveSchema>;
export type PointLight = z.infer<typeof PointLightSchema>;
export type DirectionalLight = z.infer<typeof DirectionalLightSchema>;
export type SpotLight = z.infer<typeof SpotLightSchema>;
export type _Light = z.infer<typeof LightSchema>;
export type _Group = z.infer<typeof BaseGroupSchema> & {
  groups?: _Group[];
};
export type MasterGroup = z.infer<typeof MasterGroupSchema>;
export type GlobalData = z.infer<typeof GlobalDataSchema>;
export type CameraData = z.infer<typeof CameraDataSchema>;
export type _Scenefile = z.infer<typeof ScenefileSchema>;

export type Primitive = z.infer<typeof PrimitiveSchemaWithID>;
export type Light = z.infer<typeof LightSchemaWithID>;
export type Group = z.infer<typeof BaseGroupSchemaWithID> & {
  groups?: Group[];
};
export type Scenefile = z.infer<typeof ScenefileSchemaWithIDs>;

export const Vec2Schema = z
  .array(z.number())
  .refine((data) => data.length === 2, {
    message: "Vec2 arrays should have a length of 2",
  });

export const Vec3Schema = z
  .array(z.number())
  .refine((data) => data.length === 3, {
    message: "Vec3 arrays should have a length of 3",
  });

export const Vec4Schema = z
  .array(z.number())
  .refine((data) => data.length === 4, {
    message: "Vec4 arrays should have a length of 4",
  });

export const Mat4Schema = z
  .array(z.array(z.number()))
  .refine(
    (data) => data.length === 4 && data.every((row) => row.length === 4),
    {
      message: "Mat4 should be a 4x4 matrix",
    }
  );

export const RGBSchema = z
  .array(z.number().int().nonnegative().max(255))
  .refine((data) => data.length === 3, {
    message: "RGB arrays should have a length of 3",
  });

export const PrimitiveBaseSchema = z.object({
  ambient: RGBSchema.optional(),
  diffuse: RGBSchema.optional(),
  specular: RGBSchema.optional(),
  reflective: RGBSchema.optional(),
  transparent: RGBSchema.optional(),
  shininess: z.number().optional(),
  blend: z.number().optional(),
  textureFile: z.string().optional(),
  textureU: z.number().optional(),
  textureV: z.number().optional(),
  bumpMapFile: z.string().optional(),
  bumpMapU: z.number().optional(),
  bumpMapV: z.number().optional(),
});

export const ShapePrimitiveSchema = PrimitiveBaseSchema.and(
  z.object({
    type: z.union([
      z.literal("cube"),
      z.literal("sphere"),
      z.literal("cylinder"),
      z.literal("cone"),
    ]),
  })
);

export const MeshPrimitiveSchema = PrimitiveBaseSchema.and(
  z.object({
    type: z.literal("mesh"),
    meshFile: z.string(),
  })
);

export const PrimitiveSchema = z.union([
  ShapePrimitiveSchema,
  MeshPrimitiveSchema,
]);

export const PointLightSchema = z.object({
  type: z.literal("point"),
  attenuationCoeff: Vec3Schema,
});

export const DirectionalLightSchema = z.object({
  type: z.literal("directional"),
  direction: Vec3Schema,
});

export const SpotLightSchema = z.object({
  type: z.literal("spot"),
  direction: Vec3Schema,
  penumbra: z.number(),
  thetaInner: z.number(),
  thetaOuter: z.number(),
});

export const LightSchema = z
  .object({
    name: z.string().optional(),
    color: RGBSchema,
  })
  .and(z.union([PointLightSchema, DirectionalLightSchema, SpotLightSchema]));

export const GroupTranformSchema = z.union([
  z.object({
    translate: Vec3Schema.optional(),
    rotate: Vec3Schema.optional(),
    scale: Vec3Schema.optional(),
    matrix: z.never().optional(),
  }),
  z.object({
    matrix: Mat4Schema.optional(),
    translate: z.never().optional(),
    scale: z.never().optional(),
    rotate: z.never().optional(),
  }),
]);

export const BaseGroupSchema = z
  .object({
    name: z.string().optional(),
    primitives: z.array(PrimitiveSchema).optional(),
    lights: z.array(LightSchema).optional(),
  })
  .and(GroupTranformSchema);

export const GroupSchema: z.ZodType<_Group> = BaseGroupSchema.and(
  z.object({
    groups: z.lazy(() => GroupSchema.array().optional()),
  })
);

export const MasterGroupSchema = GroupSchema.and(
  z.object({ name: z.string() })
);

export const GlobalDataSchema = z.object({
  ambientCoeff: z.number(),
  diffuseCoeff: z.number(),
  specularCoeff: z.number(),
  transparentCoeff: z.number(),
});

export const CameraDataSchema = z
  .object({
    position: Vec3Schema,
    up: Vec3Schema,
    heightAngle: z.number(),
    aperture: z.number().optional(),
    focalLength: z.number().optional(),
  })
  .and(
    z.union([
      z.object({
        look: Vec3Schema,
        focus: z.never().optional(),
      }),
      z.object({
        focus: Vec3Schema,
        look: z.never().optional(),
      }),
    ])
  );

export const ScenefileSchema = z
  .object({
    name: z.string().optional(),
    globalData: GlobalDataSchema,
    cameraData: CameraDataSchema,
    groups: z.array(GroupSchema).optional(),
  })
  .strict();

// Add ids to Group, Primitive, and Light schemas for internal use only - not part of the scenefile spec
export const PrimitiveSchemaWithID = PrimitiveSchema.and(
  z.object({ id: z.string() })
);
export const LightSchemaWithID = LightSchema.and(z.object({ id: z.string() }));
export const BaseGroupSchemaWithID = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    primitives: z.array(PrimitiveSchemaWithID).optional(),
    lights: z.array(LightSchemaWithID).optional(),
  })
  .and(GroupTranformSchema);
export const GroupSchemaWithID: z.ZodType<Group> = BaseGroupSchemaWithID.and(
  z.object({
    groups: z.lazy(() => GroupSchemaWithID.array().optional()),
  })
);
export const ScenefileSchemaWithIDs = z.object({
  name: z.string().optional(),
  globalData: GlobalDataSchema,
  cameraData: CameraDataSchema,
  groups: z.array(GroupSchemaWithID).optional(),
});
