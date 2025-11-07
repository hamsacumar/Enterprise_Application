# Contact Form API Documentation

## Overview
The Contact API handles contact form submissions, allowing users to send inquiries and enabling admins to manage submissions.

## Base URL
```
http://localhost:5000/api/contact
```

## Endpoints

### 1. Submit Contact Form
**Submit a new contact form submission**

- **URL:** `/submit`
- **Method:** `POST`
- **Authentication:** Not required (Public)
- **Content-Type:** `application/json`

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (800) 555-0123",
  "subject": "Service Inquiry",
  "message": "I would like to inquire about your services.",
  "serviceType": "booking"
}
```

#### Valid Service Types
- `general` - General inquiry
- `booking` - Booking question
- `complaint` - Complaint
- `feedback` - Feedback
- `corporate` - Corporate inquiry

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Your message has been sent successfully! We will get back to you within 24 hours.",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (800) 555-0123",
    "subject": "Service Inquiry",
    "message": "I would like to inquire about your services.",
    "serviceType": "booking",
    "submittedAt": "2025-11-07T10:30:00Z",
    "status": "pending"
  }
}
```

#### Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "Name is required",
  "data": null
}
```

---

### 2. Get All Submissions (Admin)
**Retrieve all contact form submissions with pagination**

- **URL:** `/submissions`
- **Method:** `GET`
- **Authentication:** Required (JWT Token)
- **Query Parameters:**
  - `status` (optional): Filter by status (pending, read, resolved)
  - `page` (optional): Page number (default: 1)
  - `pageSize` (optional): Items per page (default: 10, max: 100)

#### Example Request
```
GET /api/contact/submissions?status=pending&page=1&pageSize=10
Authorization: Bearer <JWT_TOKEN>
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Contact submissions retrieved successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1 (800) 555-0123",
      "subject": "Service Inquiry",
      "message": "I would like to inquire about your services.",
      "serviceType": "booking",
      "submittedAt": "2025-11-07T10:30:00Z",
      "status": "pending",
      "adminNotes": null,
      "updatedAt": null
    }
  ],
  "total": 15,
  "page": 1,
  "pageSize": 10
}
```

---

### 3. Get Submission by ID
**Retrieve a specific contact submission**

- **URL:** `/submissions/{id}`
- **Method:** `GET`
- **Authentication:** Required (JWT Token)
- **URL Parameters:**
  - `id` (required): Submission ID

#### Example Request
```
GET /api/contact/submissions/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <JWT_TOKEN>
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Submission retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (800) 555-0123",
    "subject": "Service Inquiry",
    "message": "I would like to inquire about your services.",
    "serviceType": "booking",
    "submittedAt": "2025-11-07T10:30:00Z",
    "status": "pending",
    "adminNotes": null,
    "updatedAt": null
  }
}
```

#### Error Response (404 Not Found)
```json
{
  "success": false,
  "message": "Submission not found"
}
```

---

### 4. Get Submissions by Email
**Retrieve all submissions from a specific email**

- **URL:** `/submissions/email/{email}`
- **Method:** `GET`
- **Authentication:** Required (JWT Token)
- **URL Parameters:**
  - `email` (required): Email address

#### Example Request
```
GET /api/contact/submissions/email/john@example.com
Authorization: Bearer <JWT_TOKEN>
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Found 3 submissions for john@example.com",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1 (800) 555-0123",
      "subject": "Service Inquiry",
      "message": "I would like to inquire about your services.",
      "serviceType": "booking",
      "submittedAt": "2025-11-07T10:30:00Z",
      "status": "pending"
    }
  ]
}
```

---

### 5. Update Submission Status (Admin)
**Update the status and add admin notes to a submission**

- **URL:** `/submissions/{id}/status`
- **Method:** `PUT`
- **Authentication:** Required (JWT Token)
- **Content-Type:** `application/json`
- **URL Parameters:**
  - `id` (required): Submission ID

#### Request Body
```json
{
  "status": "resolved",
  "adminNotes": "Customer inquiry has been addressed. Sent booking confirmation."
}
```

#### Valid Status Values
- `pending` - Not yet reviewed
- `read` - Read by admin
- `resolved` - Issue resolved

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Submission status updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (800) 555-0123",
    "subject": "Service Inquiry",
    "message": "I would like to inquire about your services.",
    "serviceType": "booking",
    "submittedAt": "2025-11-07T10:30:00Z",
    "status": "resolved",
    "adminNotes": "Customer inquiry has been addressed. Sent booking confirmation.",
    "updatedAt": "2025-11-07T11:00:00Z"
  }
}
```

#### Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "Invalid status"
}
```

---

### 6. Delete Submission (Admin)
**Delete a contact submission**

- **URL:** `/submissions/{id}`
- **Method:** `DELETE`
- **Authentication:** Required (JWT Token)
- **URL Parameters:**
  - `id` (required): Submission ID

#### Example Request
```
DELETE /api/contact/submissions/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <JWT_TOKEN>
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Submission deleted successfully"
}
```

#### Error Response (404 Not Found)
```json
{
  "success": false,
  "message": "Submission not found"
}
```

---

### 7. Get Statistics (Admin)
**Get statistics about contact submissions**

- **URL:** `/statistics`
- **Method:** `GET`
- **Authentication:** Required (JWT Token)

#### Example Request
```
GET /api/contact/statistics
Authorization: Bearer <JWT_TOKEN>
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "total": 25,
    "countByStatus": {
      "pending": 10,
      "read": 8,
      "resolved": 7
    },
    "pending": 10,
    "read": 8,
    "resolved": 7
  }
}
```

---

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid input data",
  "data": ["Field validation error"]
}
```

#### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "message": "Submission not found"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An error occurred while processing your request. Please try again later."
}
```

---

## Validation Rules

### Contact Submission Fields
- **Name:** Required, min 2 characters
- **Email:** Required, valid email format
- **Phone:** Required, valid phone format
- **Subject:** Required, min 5 characters
- **Message:** Required, 10-1000 characters
- **Service Type:** Required, must be one of: general, booking, complaint, feedback, corporate

---

## Integration with Frontend

The frontend uses `ContactService` to communicate with this API:

```typescript
// Submit contact form
this.contactService.submitContact(formData).subscribe(
  (response) => {
    if (response.success) {
      console.log('Form submitted successfully');
    }
  },
  (error) => {
    console.error('Error:', error);
  }
);

// Get all submissions (Admin)
this.contactService.getSubmissions().subscribe(
  (response) => {
    console.log('Submissions:', response.data);
  }
);

// Update submission status (Admin)
this.contactService.updateSubmissionStatus(id, 'resolved', 'notes').subscribe(
  (response) => {
    console.log('Status updated');
  }
);
```

---

## Testing with cURL

### Submit Contact Form
```bash
curl -X POST http://localhost:5000/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (800) 555-0123",
    "subject": "Service Inquiry",
    "message": "I would like to inquire about your services.",
    "serviceType": "booking"
  }'
```

### Get All Submissions
```bash
curl -X GET "http://localhost:5000/api/contact/submissions?page=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Status
```bash
curl -X PUT http://localhost:5000/api/contact/submissions/SUBMISSION_ID/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "resolved",
    "adminNotes": "Issue resolved"
  }'
```

---

## Future Enhancements

- [ ] Integration with MongoDB for persistent storage
- [ ] Email notifications to admin when new submission received
- [ ] Email notifications to user with submission confirmation
- [ ] Email notifications when status is updated
- [ ] Admin dashboard for managing submissions
- [ ] Export submissions to PDF/CSV
- [ ] Automated response templates
- [ ] Spam detection and filtering

