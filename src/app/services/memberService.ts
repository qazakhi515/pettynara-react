import { Messages, serverApi } from "../../lib/config";
import axios from "axios";
import {
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
} from "../../lib/types/member";
class MemberService {
  private readonly path: string;
  constructor() {
    this.path = serverApi;
  }
  // public async updateMember(
  //   memberUpdateInput: MemberUpdateInput,
  // ): Promise<Member> {
  //   try {
  //     const url = `${this.path}/member/update`;

  //     const result = await axios.post(url, memberUpdateInput, {
  //       withCredentials: true,
  //     });

  //     console.log("updateMember:", result);
  //     return result.data;
  //   } catch (err) {
  //     console.log("Error. updateMember:", err);
  //     throw err;
  //   }
  // }

  public async getTopUsers(): Promise<Member[]> {
    try {
      const url = this.path + "/member/top-users";
      const result = await axios.get(url);
      console.log("getTopUsers", result);
      return result.data;
    } catch (err) {
      console.log("Error, getProduct", err);
      throw err;
    }
  }

  public async getRestaurant(): Promise<Member> {
    try {
      const url = this.path + "/member/restaurant";
      const result = await axios.get(url);
      console.log("getRestaurant", result);
      const restaurant: Member = result.data;
      return restaurant;
    } catch (err) {
      console.log("Error, getProduct", err);
      throw err;
    }
  }

  public async signup(input: MemberInput): Promise<Member> {
    try {
      const url = this.path + "/member/signup";
      const result = await axios.post(url, input, { withCredentials: true });
      console.log("signup:", result);

      const member: Member = result.data.member;
      console.log("member:", member);
      localStorage.setItem("memberData", JSON.stringify(member));
      if (result.data.accessToken) {
        localStorage.setItem("accessToken", result.data.accessToken);
      }

      return member;
    } catch (err) {
      console.log("Error, signup:", err);
      throw err;
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    try {
      const url = this.path + "/member/login";
      const result = await axios.post(url, input, { withCredentials: true });
      console.log("login:", result);

      const member: Member = result.data.member;
      console.log("member:", member);
      localStorage.setItem("memberData", JSON.stringify(member));
      if (result.data.accessToken) {
        localStorage.setItem("accessToken", result.data.accessToken);
      }

      return member;
    } catch (err) {
      console.log("Error, login:", err);
      throw err;
    }
  }

  public async logout(): Promise<void> {
    try {
      const url = this.path + "/member/logout";
      const result = await axios.post(url, {}, { withCredentials: true });
      console.log("logout:", result);

      localStorage.removeItem("memberData");
      localStorage.removeItem("accessToken");
    } catch (err) {
      console.log("Error, logout:", err);
      throw err;
    }
  }
  public async updateMember(input: MemberUpdateInput): Promise<Member> {
    try {
      const formData = new FormData();
      formData.append("memberNick", input.memberNick || "");
      formData.append("memberPhone", input.memberPhone || "");
      formData.append("memberAddress", input.memberAddress || "");
      formData.append("memberDesc", input.memberDesc || "");
      if (input.memberImage) {
        formData.append("memberImage", input.memberImage);
      }
      const url = this.path + "/member/update";
      const result = await axios.post(url, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      // The server now wraps the document as { member }, matching login and
      // signup. Falling back to the bare body keeps this working against an
      // older backend, so the two deploys do not have to land in lockstep.
      const member: Member = result.data?.member ?? result.data;
      if (!member?._id) throw new Error(Messages.error1);

      localStorage.setItem("memberData", JSON.stringify(member));
      return member;
    } catch (err) {
      console.log("Error, updateMember:", err);
      throw err;
    }
  }
}
export default MemberService;
