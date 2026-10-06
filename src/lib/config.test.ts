import { getImageUrl, serverApi } from "./config";

describe("getImageUrl", () => {
  it("returns S3 URLs unchanged", () => {
    const url =
      "https://pettynara-uploads-2026.s3.ap-northeast-2.amazonaws.com/products/a.jpg";
    expect(getImageUrl(url)).toBe(url);
  });

  it("prefixes legacy upload paths with the API URL", () => {
    expect(getImageUrl("uploads/products/a.jpg")).toBe(
      `${serverApi}/uploads/products/a.jpg`,
    );
  });

  it("accepts plain http URLs too", () => {
    expect(getImageUrl("http://example.com/a.png")).toBe("http://example.com/a.png");
  });
});
