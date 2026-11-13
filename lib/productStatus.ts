export type ProductStatus = 'published' | 'unpublished';

/**
 * Returns 'published' or 'unpublished' for any product object.
 * Checks root property `status`, then `specs.status`, then `specs.is_published`,
 * defaulting to 'published' for legacy records.
 */
export function getProductStatus(product: { status?: string; specs?: any } | null | undefined): ProductStatus {
  if (!product) return 'published';

  // 1. Check root status property
  if (typeof product.status === 'string' && product.status.trim() !== '') {
    const s = product.status.trim().toLowerCase();
    if (s === 'unpublished' || s === 'draft' || s === 'inactive' || s === 'hidden') {
      return 'unpublished';
    }
    return 'published';
  }

  // 2. Check specs JSON property
  const specs = typeof product.specs === 'object' && product.specs !== null ? product.specs : {};
  if (typeof specs.status === 'string' && specs.status.trim() !== '') {
    const s = specs.status.trim().toLowerCase();
    if (s === 'unpublished' || s === 'draft' || s === 'inactive' || s === 'hidden') {
      return 'unpublished';
    }
    return 'published';
  }

  // 3. Check is_published boolean (in specs or root)
  if ((product as any).is_published !== undefined) {
    return (product as any).is_published === false ? 'unpublished' : 'published';
  }
  if (specs.is_published !== undefined) {
    return specs.is_published === false || specs.is_published === 'false' ? 'unpublished' : 'published';
  }

  // Default to published so pre-existing products are visible by default
  return 'published';
}

/**
 * Convenience boolean helper for frontend filtering.
 * Returns true if product is published, false if unpublished.
 */
export function isProductPublished(product: { status?: string; specs?: any } | null | undefined): boolean {
  return getProductStatus(product) === 'published';
}
