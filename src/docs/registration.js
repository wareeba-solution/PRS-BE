/**
 * @swagger
 * tags:
 *   name: Registration
 *   description: Patient registration management
 */

/**
 * @swagger
 * /registration/send-link:
 *   post:
 *     summary: Send registration link to patient
 *     tags: [Registration]
 *     description: Sends a unique registration link to the patient via email or SMS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistrationLinkRequest'
 *     responses:
 *       200:
 *         description: Registration link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Registration link sent to patient via email"
 *       400:
 *         description: Bad request, invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /registration/verify/{token}:
 *   get:
 *     summary: Verify registration token
 *     tags: [Registration]
 *     description: Validates a registration token from the link
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Registration token
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Registration link is valid"
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /registration/submit-with-token:
 *   post:
 *     summary: Submit patient registration with token
 *     tags: [Registration]
 *     description: Submit patient registration information using the token received via email/SMS. Generates a verification code for the patient to present to front desk.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistrationWithTokenRequest'
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationCodeResponse'
 *       400:
 *         description: Bad request, invalid input or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /registration/verify-code/{code}:
 *   get:
 *     summary: Get patient by verification code
 *     tags: [Registration]
 *     description: Retrieve patient information using the verification code provided by the patient at front desk
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification code provided by the patient
 *     responses:
 *       200:
 *         description: Patient data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PatientWithNextOfKinResponse'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Invalid verification code or patient not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */