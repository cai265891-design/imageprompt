export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Clerk auth functions - 占位符，实际使用Clerk的API
export const getCurrentUser = async () => {
  // 使用Clerk API获取当前用户
  return null;
};

export const authOptions = {};
