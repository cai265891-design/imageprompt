export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Clerk auth functions - 临时兼容实现
export const getCurrentUser = async (): Promise<User | null> => {
  // TODO: 实现Clerk集成
  // 返回 null 表示未登录状态
  return null;
};

export const authOptions = {};
