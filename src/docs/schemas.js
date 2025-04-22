/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       required:
 *         - surname
 *         - otherNames
 *         - dateOfBirth
 *         - age
 *         - occupation
 *         - maritalStatus
 *         - contactAddress
 *         - phoneNumber
 *         - emailAddress
 *         - ethnicity
 *         - gender
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         surname:
 *           type: string
 *           description: Patient's surname/last name
 *         otherNames:
 *           type: string
 *           description: Patient's other names (first and middle names)
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Patient's date of birth (YYYY-MM-DD)
 *         age:
 *           type: integer
 *           description: Patient's age in years
 *         occupation:
 *           type: string
 *           description: Patient's occupation or profession
 *         maritalStatus:
 *           type: string
 *           enum: [Single, Married, Divorced, Widowed, Other]
 *           description: Patient's marital status
 *         contactAddress:
 *           type: string
 *           description: Patient's residential or contact address
 *         phoneNumber:
 *           type: string
 *           description: Patient's phone number
 *         emailAddress:
 *           type: string
 *           format: email
 *           description: Patient's email address
 *         ethnicity:
 *           type: string
 *           description: Patient's ethnicity or race
 *         gender:
 *           type: string
 *           enum: [Male, Female, Other, Prefer not to say]
 *           description: Patient's gender
 *         registrationDate:
 *           type: string
 *           format: date-time
 *           description: Date and time when patient was registered
 *         registrationCode:
 *           type: string
 *           description: Unique registration code for the patient
 *         nextOfKin:
 *           type: string
 *           description: Reference ID to the next of kin
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time record was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time record was last updated
 *       example:
 *         surname: "Smith"
 *         otherNames: "John David"
 *         dateOfBirth: "1985-06-15"
 *         age: 38
 *         occupation: "Software Engineer"
 *         maritalStatus: "Married"
 *         contactAddress: "123 Main St, Anytown"
 *         phoneNumber: "+1234567890"
 *         emailAddress: "john.smith@example.com"
 *         ethnicity: "Caucasian"
 *         gender: "Male"
 *         registrationDate: "2023-01-15T08:30:00Z"
 *         registrationCode: "ABC12345"
 *
 *     NextOfKin:
 *       type: object
 *       required:
 *         - surname
 *         - otherNames
 *         - dateOfBirth
 *         - age
 *         - occupation
 *         - maritalStatus
 *         - contactAddress
 *         - phoneNumber
 *         - emailAddress
 *         - ethnicity
 *         - gender
 *         - relationshipToPatient
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         surname:
 *           type: string
 *           description: Next of kin's surname/last name
 *         otherNames:
 *           type: string
 *           description: Next of kin's other names (first and middle names)
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Next of kin's date of birth (YYYY-MM-DD)
 *         age:
 *           type: integer
 *           description: Next of kin's age in years
 *         occupation:
 *           type: string
 *           description: Next of kin's occupation or profession
 *         maritalStatus:
 *           type: string
 *           enum: [Single, Married, Divorced, Widowed, Other]
 *           description: Next of kin's marital status
 *         contactAddress:
 *           type: string
 *           description: Next of kin's residential or contact address
 *         phoneNumber:
 *           type: string
 *           description: Next of kin's phone number
 *         emailAddress:
 *           type: string
 *           format: email
 *           description: Next of kin's email address
 *         ethnicity:
 *           type: string
 *           description: Next of kin's ethnicity or race
 *         gender:
 *           type: string
 *           enum: [Male, Female, Other, Prefer not to say]
 *           description: Next of kin's gender
 *         relationshipToPatient:
 *           type: string
 *           description: Relationship of next of kin to the patient (e.g., Spouse, Parent, Child, Sibling)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time record was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time record was last updated
 *       example:
 *         surname: "Smith"
 *         otherNames: "Emily Jane"
 *         dateOfBirth: "1988-03-20"
 *         age: 35
 *         occupation: "Accountant"
 *         maritalStatus: "Married"
 *         contactAddress: "123 Main St, Anytown"
 *         phoneNumber: "+1987654321"
 *         emailAddress: "emily.smith@example.com"
 *         ethnicity: "Caucasian"
 *         gender: "Female"
 *         relationshipToPatient: "Spouse"
 *
 *     RegistrationCode:
 *       type: object
 *       required:
 *         - code
 *         - patientData
 *         - expiresAt
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         code:
 *           type: string
 *           description: Unique registration code
 *         patientData:
 *           type: object
 *           description: Patient registration data
 *         isUsed:
 *           type: boolean
 *           description: Whether the registration code has been used
 *           default: false
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           description: Expiration date and time of the registration code
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time the registration code was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time the registration code was last updated
 *       example:
 *         code: "ABC12345"
 *         patientData: {}
 *         isUsed: false
 *         expiresAt: "2023-01-22T08:30:00Z"
 *
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address (used for login)
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (hashed)
 *         role:
 *           type: string
 *           enum: [admin, staff]
 *           description: User's role in the system
 *         resetPasswordToken:
 *           type: string
 *           description: Token for password reset (if applicable)
 *         resetPasswordExpire:
 *           type: string
 *           format: date-time
 *           description: Expiration of password reset token
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time the user was last updated
 *       example:
 *         name: "Admin User"
 *         email: "admin@hospital.com"
 *         role: "admin"
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *       example:
 *         email: "admin@hospital.com"
 *         password: "password123"
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Whether the login was successful
 *         token:
 *           type: string
 *           description: JWT authentication token
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: User ID
 *             name:
 *               type: string
 *               description: User's full name
 *             email:
 *               type: string
 *               description: User's email address
 *             role:
 *               type: string
 *               description: User's role
 *       example:
 *         success: true
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           id: "60d21b4667d0d8992e610c85"
 *           name: "Admin User"
 *           email: "admin@hospital.com"
 *           role: "admin"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Always false for errors
 *           default: false
 *         message:
 *           type: string
 *           description: Error message
 *       example:
 *         success: false
 *         message: "Invalid credentials"
 *
 *     RegistrationLinkRequest:
 *       type: object
 *       required:
 *         - contactMethod
 *         - contactValue
 *       properties:
 *         contactMethod:
 *           type: string
 *           enum: [email, sms]
 *           description: Method to send registration link
 *         contactValue:
 *           type: string
 *           description: Email address or phone number
 *       example:
 *         contactMethod: "email"
 *         contactValue: "patient@example.com"
 */