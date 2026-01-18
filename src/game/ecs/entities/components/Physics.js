import { z } from 'zod';

// --- Physics Schema Definitions ---

export const PhysicsVelocitySchema = z.object({
  x: z.number().default(0),
  y: z.number().default(0)
});

export const PhysicsBoundsSchema = z.object({
  minX: z.number().default(0),
  maxX: z.number().default(9999),
  minY: z.number().default(0),
  maxY: z.number().default(9999)
});

export const PhysicsStaticBodySchema = z.object({
  static: z.literal(true).default(true),
  width: z.number().default(30),
  height: z.number().default(30),
  radius: z.number().default(15)
});

// --- Physics Factory ---

export const Physics = {
  /**
   * 速度组件
   */
  Velocity(x, y) {
    if (!PhysicsVelocitySchema) return { x: 0, y: 0 };

    const result = PhysicsVelocitySchema.safeParse({ x, y });
    if (result.success) {
      return result.data;
    } else {
      console.error('[Physics] Velocity validation failed', result.error);
      return { x: 0, y: 0 };
    }
  },

  /**
   * 边界组件 (通常用于地图边界限制)
   */
  Bounds(minX, maxX, minY, maxY) {
    if (!PhysicsBoundsSchema) return { minX: 0, maxX: 9999, minY: 0, maxY: 9999 };

    const result = PhysicsBoundsSchema.safeParse({ minX, maxX, minY, maxY });
    if (result.success) {
      return result.data;
    } else {
      console.error('[Physics] Bounds validation failed', result.error);
      return { minX: 0, maxX: 9999, minY: 0, maxY: 9999 };
    }
  },

  /**
   * 静态刚体 (用于不可移动的物体，如NPC)
   */
  StaticBody(width, height, radius) {
    if (!PhysicsStaticBodySchema) return { static: true, width: 30, height: 30, radius: 15 };

    const result = PhysicsStaticBodySchema.safeParse({ width, height, radius });
    if (result.success) {
      return result.data;
    } else {
      console.error('[Physics] StaticBody validation failed', result.error);
      return { static: true, width: 30, height: 30, radius: 15 };
    }
  }
}
