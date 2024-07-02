// import { Answer, BookingStatus, Category, CleaningStatus, Country, Floor, Gender, GuestHouse, IDCardType, MaritalStatus, Nationality, Occupancy, PrismaClient, Religion, RoomTariff, RoomType, State, TypeOrg, UserPermissionRole } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//   const user1 = await prisma.user.create({
//     data: {
//       name: "user1" + Math.random(),
//       email: "user1@user1" + Math.random(),
//       role: UserPermissionRole.USER,
//       password: "password"
//     },
//   });

//   const user2 = await prisma.user.create({
//     data: {
//       name: "user2" + Math.random(),
//       email: "user2@user2" + Math.random(),
//       role: UserPermissionRole.ADMIN,
//       password: "password"
//     },
//   });

//   const guest1 = await prisma.guestProfile.create({
//     data: {
//       name: "John Doe" + Math.random(),
//       email: "john.doe@example.com",
//       alternativeEmail: "j.doe@anothermail.com",
//       mobileNo: "1234567890",
//       alternativeMobileNo: "0987654321",
//       identity_card_type: IDCardType.DRIVING_LICENSE, // Assuming PASSPORT is an enum value for IDCardType
//       id_card_no: "X1234567",
//       fatherHusbandName: "Jane Doe",
//       nationality: Nationality.INDIAN, // Assuming AMERICAN is an enum value for Nationality
//       religion: Religion.HINDU, // Assuming CHRISTIANITY is an enum value for Religion
//       typeOrg: TypeOrg.PRIVATE, // Assuming PRIVATE is an enum value for TypeOrg
//       designation: "Developer",
//       orgName: "Tech Solutions Inc",
//       orgEmail: "contact@techsolutions.com",
//       orgPhone: "1112223333",
//       orgWebsite: "https://www.techsolutions.com",
//       residentialCity: "New York",
//       residentialDistt: "New York",
//       residentialState: State.MAHARASTRA, // Assuming NY is an enum value for State
//       country: Country.INDIA, // Assuming USA is an enum value for Country
//       orgAddress: "123 Tech Park, Silicon Alley, New York, NY, 10001",
//       physicallyChallenged: Answer.NO, // Assuming NO is an enum value for Answer
//       gender: Gender.MALE, // Assuming MALE is an enum value for Gender
//       category: Category.GEN, // Assuming GENERAL is an enum value for Category
//       localAddress: "123 Main St, Apt 4B, New York, NY, 10001",
//       permanentAddress: "456 Country Rd, Springfield, IL, 62701",
//       dob: new Date("1990-01-01T00:00:00Z"),
//       maritalStatus: MaritalStatus.MARRIED, // Assuming SINGLE is an enum value for MaritalStatus
//       remark: "No remarks.",
//       userId: user1.id
//     }
//   })


//   const guest2 = await prisma.guestProfile.create({
//     data: {
//       name: "guest2",
//       email: "john.doe@example.com",
//       alternativeEmail: "j.doe@anothermail.com",
//       mobileNo: "1234567890",
//       alternativeMobileNo: "0987654321",
//       identity_card_type: IDCardType.DRIVING_LICENSE, // Assuming PASSPORT is an enum value for IDCardType
//       id_card_no: "X1234567",
//       fatherHusbandName: "Jane Doe",
//       nationality: Nationality.INDIAN, // Assuming AMERICAN is an enum value for Nationality
//       religion: Religion.HINDU, // Assuming CHRISTIANITY is an enum value for Religion
//       typeOrg: TypeOrg.PRIVATE, // Assuming PRIVATE is an enum value for TypeOrg
//       designation: "Developer",
//       orgName: "Tech Solutions Inc",
//       orgEmail: "contact@techsolutions.com",
//       orgPhone: "1112223333",
//       orgWebsite: "https://www.techsolutions.com",
//       residentialCity: "New York",
//       residentialDistt: "New York",
//       residentialState: State.MAHARASTRA, // Assuming NY is an enum value for State
//       country: Country.INDIA, // Assuming USA is an enum value for Country
//       orgAddress: "123 Tech Park, Silicon Alley, New York, NY, 10001",
//       physicallyChallenged: Answer.NO, // Assuming NO is an enum value for Answer
//       gender: Gender.MALE, // Assuming MALE is an enum value for Gender
//       category: Category.GEN, // Assuming GENERAL is an enum value for Category
//       localAddress: "123 Main St, Apt 4B, New York, NY, 10001",
//       permanentAddress: "456 Country Rd, Springfield, IL, 62701",
//       dob: new Date("1990-01-01T00:00:00Z"),
//       maritalStatus: MaritalStatus.MARRIED, // Assuming SINGLE is an enum value for MaritalStatus
//       remark: "No remarks.",
//       userId: user2.id

//     }
//   })


//   const bookingDetail1 = await prisma.bookingDetails.create({
//     data: {
//       userId: user1.id,
//       bookingStatus: BookingStatus.UNCONFIRMED,
//       hostelName: GuestHouse.EXECUTIVE_GUEST_HOUSE,
//       updateBy: "Candidate",
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       bookingDate: new Date().toISOString(),
//       bookedFromDt: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
//       bookedToDt: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
//       remark: "Looking forward to the stay.",
//       bookPaymentId: "cuid789payment"
//     }
//   })


//   const bookingDetail2 = await prisma.bookingDetails.create({
//     data: {
//       userId: user2.id,
//       bookingStatus: BookingStatus.CANCELED,
//       hostelName: GuestHouse.EXECUTIVE_GUEST_HOUSE,
//       updateBy: "Candidate",
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       bookingDate: new Date().toISOString(),
//       bookedFromDt: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
//       bookedToDt: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
//       remark: "Looking forward to the stay.",
//       bookPaymentId: "cuid789payment" // This should be a valid ID from the `bookingPayments` table
//     }
//   })


//   const saranRoomPictures = ["https://aakash2330-drippy.s3.amazonaws.com/NITTTR/saran/fwdsaranguesthouselatestphotograph/_DSC0346+(2).JPG", "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/saran/fwdsaranguesthouselatestphotograph/DSC_0127.JPG", "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/saran/fwdsaranguesthouselatestphotograph/DSC_0136.JPG", "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/saran/fwdsaranguesthouselatestphotograph/DSC_0137.JPG", "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/saran/fwdsaranguesthouselatestphotograph/DSC_0140.JPG"]
//   for (let i = 0; i < saranRoomPictures.length; i++) {
//     const roomDetails = await prisma.roomDetails.create({
//       data: {
//         code: "RM100" + i,
//         roomImg: saranRoomPictures,
//         hostelName: GuestHouse.SARAN_GUEST_HOUSE,
//         value: "Deluxe Room",
//         ghName: "Grand Hotel",
//         roomType: RoomType.FOUR_BED,
//         occupancy: Occupancy.DOUBLE,
//         floor: Floor.FIRST_FLOOR,
//         ac: Answer.YES,
//         geaser: Answer.YES,
//         airCooled: Answer.NO,
//         maxAdult: "2",
//         maxChild: "2",
//         remark: "Experience comfort and convenience in our single rooms at NITTTR Bhopal. Perfect for solo travelers or individuals seeking privacy. Explore our affordable accommodation options today!",
//         updateBy: "Admin",
//         updateDt: new Date().toISOString(),
//         roomTarrif: RoomTariff.EXECTIVE_3500, // Assuming STANDARD is a valid enum value for RoomTariff
//         rentPerDay: "1000.00",
//         taxes: "180.00",
//         totalChargePerDay: "1180.00",
//         bookingStatus: BookingStatus.EXPIRED, // Assuming AVAILABLE is a valid enum value for BookingStatus
//         cleaningStatus: CleaningStatus.READY, // Assuming CLEAN is a valid enum value for CleaningStatus
//         lastCleaningDate: new Date().toISOString(),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         bookingDetailsId: bookingDetail1.id
//       }

//     })
//   }

//   const executeRoomPictures = ["https://aakash2330-drippy.s3.amazonaws.com/NITTTR/fwdexecutivehostelphotograph/DSC_1095.JPG", "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/fwdexecutivehostelphotograph/DSC_1107.JPG", "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/fwdexecutivehostelphotograph/DSC_1115.JPG", "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/fwdexecutivehostelphotograph/DSC_1120.JPG"]
//   for (let i = 0; i < executeRoomPictures.length; i++) {
//     const roomDetails = await prisma.roomDetails.create({
//       data: {
//         code: "EX100" + i,
//         roomImg: executeRoomPictures,
//         hostelName: GuestHouse.EXECUTIVE_GUEST_HOUSE,
//         value: "Deluxe Room",
//         ghName: "Grand Hotel",
//         roomType: RoomType.SINGLE_BED, // Assuming DELUXE is a valid enum value for RoomType
//         occupancy: Occupancy.SINGLE, // Assuming DOUBLE is a valid enum value for Occupancy
//         floor: Floor.FIRST_FLOOR, // Assuming FIRST_FLOOR is a valid enum value for Floor
//         ac: Answer.YES, // Assuming YES is a valid enum value for Answer
//         geaser: Answer.YES, // Assuming YES is a valid enum value for Answer
//         airCooled: Answer.NO, // Assuming NO is a valid enum value for Answer
//         maxAdult: "2",
//         maxChild: "2",
//         remark: "Experience a blend of comfort and sophistication in our Executive Double Room at the prestigious NITTTR Bhopal Guesthouse. Designed with your utmost comfort in mind, our spacious double room offers a serene ambiance, perfect for unwinding after a day of exploration.",
//         updateBy: "Admin",
//         updateDt: new Date().toISOString(),
//         roomTarrif: RoomTariff.EXECTIVE_3500, // Assuming STANDARD is a valid enum value for RoomTariff
//         rentPerDay: "2000.00",
//         taxes: "180.00",
//         totalChargePerDay: "2180.00",
//         bookingStatus: BookingStatus.CONFIRMED, // Assuming AVAILABLE is a valid enum value for BookingStatus
//         cleaningStatus: CleaningStatus.READY, // Assuming CLEAN is a valid enum value for CleaningStatus
//         lastCleaningDate: new Date().toISOString(),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         bookingDetailsId: bookingDetail2.id
//       }

//     })
//   }


//   const viswesawraiyaguesthousePictures = ["https://aakash2330-drippy.s3.amazonaws.com/NITTTR/fwdviswesawraiyaguesthouse/DSC_0067.JPG", "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/fwdviswesawraiyaguesthouse/DSC_0067.JPG", "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/fwdviswesawraiyaguesthouse/DSC_0111.JPG", "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/fwdviswesawraiyaguesthouse/DSC_1422.JPG"]
//   for (let i = 0; i < viswesawraiyaguesthousePictures.length; i++) {
//     const roomDetails = await prisma.roomDetails.create({
//       data: {
//         code: "EX100" + i,
//         roomImg: viswesawraiyaguesthousePictures,
//         hostelName: GuestHouse.VISVESVARAYA_GUEST_HOUSE,
//         value: "Deluxe Room",
//         ghName: "Grand Hotel",
//         roomType: RoomType.FOUR_BED, // Assuming DELUXE is a valid enum value for RoomType
//         occupancy: Occupancy.TRIPLE, // Assuming DOUBLE is a valid enum value for Occupancy
//         floor: Floor.GROUND_FLOOR, // Assuming FIRST_FLOOR is a valid enum value for Floor
//         ac: Answer.YES, // Assuming YES is a valid enum value for Answer
//         geaser: Answer.YES, // Assuming YES is a valid enum value for Answer
//         airCooled: Answer.NO, // Assuming NO is a valid enum value for Answer
//         maxAdult: "2",
//         maxChild: "2",
//         remark: "Discover spacious and cozy double rooms at NITTTR Bhopal, ideal for couples or friends traveling together. Enjoy a comfortable stay with modern amenities. Book your room now!",
//         updateBy: "Admin",
//         updateDt: new Date().toISOString(),
//         roomTarrif: RoomTariff.EXECTIVE_3500, // Assuming STANDARD is a valid enum value for RoomTariff
//         rentPerDay: "800.00",
//         taxes: "180.00",
//         totalChargePerDay: "980.00",
//         bookingStatus: BookingStatus.CANCELED, // Assuming AVAILABLE is a valid enum value for BookingStatus
//         cleaningStatus: CleaningStatus.READY, // Assuming CLEAN is a valid enum value for CleaningStatus
//         lastCleaningDate: new Date().toISOString(),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       }

//     })
//   }

//   const masterPrices = await prisma.roomCharges.createMany({
//     data: [{
//       hostelName: "SARAN_GUEST_HOUSE",
//       STATE_GOVT: 800,
//       OTHER: 600,
//       PRIVATE: 3000,
//       CENTRAL_GOVT: 500,

//     }, {
//       hostelName: "EXECUTIVE_GUEST_HOUSE",
//       STATE_GOVT: 1000,
//       OTHER: 1000,
//       PRIVATE: 1000,
//       CENTRAL_GOVT: 1000,

//     }, {
//       hostelName: "VISVESVARAYA_GUEST_HOUSE",
//       STATE_GOVT: 300,
//       OTHER: 400,
//       PRIVATE: 2000,
//       CENTRAL_GOVT: 700,

//     }]
//   })

// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
