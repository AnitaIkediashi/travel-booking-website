import { contactInfoSchema, passengerSchema } from "@/lib/zod_schema";


const validPassenger = {
  firstName: "Anita",
  lastName: "O'Brien",
  gender: "FEMALE",
  nationality: "NG",
  dateOfBirth: "1995-04-12",
};

const badNames = [
  "John123",
  "<script>alert(1)</script>",
  "'; DROP TABLE users;--",
  "   ",
  "-",
  "'",
  "a".repeat(51),
  "{{7*7}}",
  "${process.env.SECRET}",
  "John\u0000Doe",
  "<img src=x onerror=alert(1)>",
  "=cmd|' /C calc'!A0",
];

describe("name fields", () => {
  it.each(badNames)("rejects %s", (name) => {
    expect(
      passengerSchema.safeParse({ ...validPassenger, firstName: name }).success,
    ).toBe(false);
    expect(
      passengerSchema.safeParse({ ...validPassenger, lastName: name }).success,
    ).toBe(false);
  });

  it.each(["Anita", "José", "Mary-Jane", "O'Brien", "Chukwuemeka"])(
    "accepts %s",
    (name) => {
      expect(
        passengerSchema.safeParse({ ...validPassenger, firstName: name })
          .success,
      ).toBe(true);
    },
  );

  it("trims whitespace", () => {
    expect(
      passengerSchema.parse({ ...validPassenger, firstName: "  Mary  " })
        .firstName,
    ).toBe("Mary");
  });
});

describe("other fields", () => {
  it.each(["banana", "ZZ", "", undefined, "N".repeat(1000)])(
    "rejects nationality %p",
    (n) => {
      expect(
        passengerSchema.safeParse({ ...validPassenger, nationality: n })
          .success,
      ).toBe(false);
    },
  );

  it.each([
    "",
    "2023-02-31",
    "1/1/2000",
    "March 3 2000",
    "0001-01-01",
    "2999-01-01",
    "not-a-date",
  ])("rejects date %p", (d) => {
    expect(
      passengerSchema.safeParse({ ...validPassenger, dateOfBirth: d }).success,
    ).toBe(false);
  });

  it("normalizes email and phone", () => {
    const r = contactInfoSchema.parse({
      email: "  Anita@Mail.COM ",
      phoneNo: "08012345678",
    });
    expect(r.email).toBe("anita@mail.com");
    expect(r.phoneNo).toBe("+2348012345678");
  });

  it("rejects non-string input types", () => {
    expect(
      passengerSchema.safeParse({ ...validPassenger, firstName: { $ne: null } })
        .success,
    ).toBe(false);
    expect(
      passengerSchema.safeParse({ ...validPassenger, firstName: ["a"] })
        .success,
    ).toBe(false);
  });
});
