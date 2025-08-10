<!-- post\docs\erd.md -->

# Post Service: Entities & Relationship

* **post**

  * Stores posts and their metadata

**Relationship:**

Each post can be posted by a user.
Each post can have one original post (self-reference).
Each post can have many shares.

---

> **Naming note**:  
> Field names in this ERD are shown in `snake_case` for readability.  
> The corresponding Prisma models use `camelCase` — refer to the Prisma schema for exact field names.
