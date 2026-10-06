import { isValidPhone, sanitizePhone } from "./phone";

describe("isValidPhone", () => {
  it.each(["01012345678", "+82 10-1234-5678", "(010) 1234 5678"])(
    "accepts %s",
    (phone) => expect(isValidPhone(phone)).toBe(true),
  );

  it.each(["", "12345678", "1234567890123456", "010-abcd-5678"])(
    "rejects %p",
    (phone) => expect(isValidPhone(phone)).toBe(false),
  );
});

describe("sanitizePhone", () => {
  it("drops characters people should not type", () => {
    expect(sanitizePhone("010#1234@5678abc")).toBe("01012345678");
  });

  it("keeps at most 20 characters", () => {
    expect(sanitizePhone("1".repeat(30))).toHaveLength(20);
  });
});
