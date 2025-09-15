export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Clerk auth functions - 临时兼容实现
export const getCurrentUser = async (): Promise<User | null> => {
  // TODO: 实现Clerk集成
  // 临时返回兼容结构，避免类型错误
  return {
    id: "temp-user-id",
    email: "temp@example.com",
    name: "Temp User",
    image: null,
  };
};

export const authOptions = {};
