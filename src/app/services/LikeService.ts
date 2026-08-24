import axios from "axios";
import { serverApi } from "../../lib/config";
import { Product } from "../../lib/types/product";

export interface LikeToggleResult {
  liked: boolean;
  likesCount: number;
}

/**
 * Likes live on the server and belong to the signed-in member, so every call
 * here needs the session cookie. All three endpoints sit behind verifyAuth and
 * answer 401 when the caller is not logged in.
 */
class LikeService {
  private readonly path: string;
  constructor() {
    this.path = serverApi;
  }

  public async toggleLike(productId: string): Promise<LikeToggleResult> {
    try {
      const url = `${this.path}/product/${productId}/like`;
      const result = await axios.post(url, {}, { withCredentials: true });
      return result.data;
    } catch (err) {
      console.log("Error, toggleLike:", err);
      throw err;
    }
  }

  public async getMyLikes(): Promise<Product[]> {
    try {
      const url = `${this.path}/member/likes`;
      const result = await axios.get(url, { withCredentials: true });
      return result.data;
    } catch (err) {
      console.log("Error, getMyLikes:", err);
      throw err;
    }
  }

  /** Hand over the likes collected before signing in. */
  public async syncLikes(productIds: string[]): Promise<Product[]> {
    try {
      const url = `${this.path}/member/likes/sync`;
      const result = await axios.post(
        url,
        { productIds },
        { withCredentials: true },
      );
      return result.data;
    } catch (err) {
      console.log("Error, syncLikes:", err);
      throw err;
    }
  }
}

export default LikeService;
