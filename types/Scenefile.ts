import { z } from "zod";

export type Vec2 = z.infer<typeof Vec2Schema>;
export type Vec3 = z.infer<typeof Vec3Schema>;
export type Vec4 = z.infer<typeof Vec4Schema>;
export type Mat4 = z.infer<typeof Mat4Schema>;
export type RGB = z.infer<typeof RGBSchema>;
export type PrimitiveBase = z.infer<typeof PrimitiveBaseSchema>;
export type ShapePrimitive = z.infer<typeof ShapePrimitiveSchema>;
export type MeshPrimitive = z.infer<typeof MeshPrimitiveSchema>;
export type Primitive = z.infer<typeof PrimitiveSchema>;
export type PointLight = z.infer<typeof PointLightSchema>;
export type DirectionalLight = z.infer<typeof DirectionalLightSchema>;
export type SpotLight = z.infer<typeof SpotLightSchema>;
export type Light = z.infer<typeof LightSchema>;
export type Group = z.infer<typeof BaseGroupSchema> & {
  groups?: Group[];
};
export type MasterGroup = z.infer<typeof MasterGroupSchema>;
export type GlobalData = z.infer<typeof GlobalDataSchema>;
export type CameraData = z.infer<typeof CameraDataSchema>;
export type Scenefile = z.infer<typeof ScenefileSchema>;

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
  position: Vec3Schema,
  attenuationCoeff: Vec3Schema,
});

export const DirectionalLightSchema = z.object({
  type: z.literal("directional"),
  direction: Vec3Schema,
});

export const SpotLightSchema = z.object({
  type: z.literal("spot"),
  position: Vec3Schema,
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

export const BaseGroupSchema = z
  .object({
    name: z.string().optional(),
    primitives: z.array(PrimitiveSchema).optional(),
    lights: z.array(LightSchema).optional(),
  })
  .and(
    z.union([
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
    ])
  );

export const GroupSchema: z.ZodType<Group> = BaseGroupSchema.and(
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

export const cubeScene: Scenefile = {
  name: "cube",
  globalData: {
    ambientCoeff: 0.1,
    diffuseCoeff: 0.7,
    specularCoeff: 0.2,
    transparentCoeff: 0.0,
  },
  cameraData: {
    position: [0, 0, 5],
    up: [0, 1, 0],
    look: [0, 0, 0],
    heightAngle: 45,
  },
  groups: [
    {
      name: "cube",
      translate: [0, 0, 0],
      primitives: [
        {
          type: "cube",
          ambient: [0, 0, 0],
          diffuse: [0, 0, 1],
          specular: [1, 1, 1],
          shininess: 10,
        },
      ],
    },
  ],
};
