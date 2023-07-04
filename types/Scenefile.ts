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
export type MasterGroup = z.infer<typeof MasterGroupSchema>;
export type GlobalData = z.infer<typeof GlobalDataSchema>;
export type CameraData = z.infer<typeof CameraDataSchema>;
export type Scenefile = z.infer<typeof SceneFileSchema>;

const Vec2Schema = z.array(z.number()).refine((data) => data.length === 2, {
  message: "Vec2 arrays should have a length of 2",
});

const Vec3Schema = z.array(z.number()).refine((data) => data.length === 3, {
  message: "Vec3 arrays should have a length of 3",
});

const Vec4Schema = z.array(z.number()).refine((data) => data.length === 4, {
  message: "Vec4 arrays should have a length of 4",
});

const Mat4Schema = z
  .array(z.array(z.number()))
  .refine(
    (data) => data.length === 4 && data.every((row) => row.length === 4),
    {
      message: "Mat4 should be a 4x4 matrix",
    }
  );

const RGBSchema = z
  .array(z.number().int().nonnegative().max(255))
  .refine((data) => data.length === 3, {
    message: "RGB arrays should have a length of 3",
  });

const PrimitiveBaseSchema = z.object({
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

const ShapePrimitiveSchema = PrimitiveBaseSchema.and(
  z.object({
    type: z.union([
      z.literal("cube"),
      z.literal("sphere"),
      z.literal("cylinder"),
      z.literal("cone"),
    ]),
  })
);

const MeshPrimitiveSchema = PrimitiveBaseSchema.and(
  z.object({
    type: z.literal("mesh"),
    meshFile: z.string(),
  })
);

const PrimitiveSchema = z.union([ShapePrimitiveSchema, MeshPrimitiveSchema]);

const PointLightSchema = z.object({
  type: z.literal("point"),
  position: Vec3Schema,
  attenuationCoeff: Vec3Schema,
});

const DirectionalLightSchema = z.object({
  type: z.literal("directional"),
  direction: Vec3Schema,
});

const SpotLightSchema = z.object({
  type: z.literal("spot"),
  position: Vec3Schema,
  direction: Vec3Schema,
  penumbra: z.number(),
  thetaInner: z.number(),
  thetaOuter: z.number(),
});

const LightSchema = z
  .object({
    name: z.string().optional(),
    color: RGBSchema,
  })
  .and(z.union([PointLightSchema, DirectionalLightSchema, SpotLightSchema]));

const BaseGroupSchema = z
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

type Group = z.infer<typeof BaseGroupSchema> & {
  groups?: Group[];
};

const GroupSchema: z.ZodType<Group> = BaseGroupSchema.and(
  z.object({
    groups: z.lazy(() => GroupSchema.array()).optional(),
  })
);

const MasterGroupSchema = GroupSchema.and(z.object({ name: z.string() }));

const GlobalDataSchema = z.object({
  ambientCoeff: z.number(),
  diffuseCoeff: z.number(),
  specularCoeff: z.number(),
  transparentCoeff: z.number(),
});

const CameraDataSchema = z
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

const SceneFileSchema = z
  .object({
    name: z.string().optional(),
    globalData: GlobalDataSchema,
    cameraData: CameraDataSchema,
    groups: z.array(GroupSchema),
  })
  .strict();
