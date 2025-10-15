# Evidence Upload Feature Documentation

## Overview
The mission submission page now supports multiple evidence types including photos, videos, documents, audio recordings, text input, and GPS location.

## Features

### Supported Evidence Types

#### 1. Photo Evidence
- Device photo gallery access
- Image cropping and editing
- Quality optimization (80%)

#### 2. Video Evidence
- Device video gallery access
- Maximum duration: 60 seconds
- Medium quality compression

#### 3. Document Evidence
- **PDF Documents** (.pdf)
- **Microsoft Word** (.doc, .docx)
- **Microsoft Excel** (.xls, .xlsx)
- **Text Files** (.txt)
- **Images** (via document picker)

#### 4. Audio Evidence
- High-quality audio recording
- Built-in microphone access
- Format: M4A (AAC)
- Start/stop recording controls

#### 5. Text Evidence
- Direct text input via textarea
- No file upload needed

#### 6. GPS Location Evidence
- Current device location
- Accuracy metadata
- Timestamp included

### File Size Limits
- **Documents**: Maximum 10 MB
- **Photos**: Optimized automatically
- **Videos**: Medium quality compression
- **Audio**: High-quality recording (file size varies by duration)

## User Flow

### For Photo Evidence Requirements
When a mission step requires "photo" evidence, users now have two options:

1. **Select Photo from Gallery**
   - Opens the device's photo gallery
   - Allows selecting an image
   - Provides basic editing (cropping)
   - Optimized quality: 80%

2. **Upload Document/File**
   - Opens the device's file picker
   - Allows selecting PDF, DOC, XLS, TXT, or image files
   - Validates file size (max 10 MB)
   - Displays file name and size after selection

### For Video Evidence Requirements
- Opens the device's video gallery
- Maximum video duration: 60 seconds
- Medium quality compression

### For Text Evidence Requirements
- Textarea input for direct text entry
- No file upload needed

### For Location Evidence Requirements
- Uses device GPS to capture current location
- Includes accuracy and timestamp metadata

## Technical Implementation

### Dependencies

```json
{
  "expo-document-picker": "^12.0.2",
  "expo-image-picker": "^16.1.4",
  "expo-location": "~18.1.6",
  "expo-av": "^14.0.7"
}
```

### Key Functions

#### Photo & Video Functions
- `handleSelectPhoto()` - Opens photo gallery with editing
- `handleSelectVideo()` - Opens video gallery with duration limit
- `uploadFile(asset, type)` - Handles photo/video upload to storage

#### Document Functions
- `handleSelectDocument()` - Opens document picker with MIME type filtering
- `uploadDocument(document)` - Uploads documents to Supabase storage
- Validates file size (10MB limit)

#### Audio Functions
- `startAudioRecording()` - Requests mic permission and starts recording
- `stopAudioRecording()` - Stops recording and saves audio file
- `uploadAudioRecording(uri)` - Uploads audio to Supabase storage
- Uses high-quality recording presets (M4A format)

#### Location Functions
- `handleGetLocation()` - Gets current GPS coordinates
- Includes accuracy and timestamp metadata

#### Evidence Display
- `renderEvidenceItem()` - Intelligently renders evidence based on type
- Detects file types (photo, video, document, audio, text, location)
- Displays appropriate icons and metadata
- Shows file size for uploaded files

## UI/UX Considerations

### Visual Feedback
- Document button uses retro styling matching app theme
- Shows file type information: "(PDF, DOC, XLS, etc.)"
- Displays file size after selection
- Loading state while uploading (button disabled)

### Error Handling
- File too large: "Please select a file smaller than 10MB."
- Upload failure: "Failed to upload document. Please try again."
- Picker cancelled: Silent return (no error)

## Security & Privacy

### Permissions
- **Photo Library**: Required for image/video selection
- **Location**: Required only for location evidence
- **File System**: Handled automatically by `expo-document-picker`

### Storage
- All files uploaded to Supabase storage buckets
- Files associated with mission submissions
- RLS policies control access

## Future Enhancements

### Potential Improvements
1. Add support for more file types (ZIP, CSV, etc.)
2. Add file preview before upload
3. Support multiple file selection
4. Add progress indicator for large files
5. Implement file compression for large uploads
6. Add drag-and-drop support (web platform)

## Testing Checklist

### Photo Evidence
- [ ] Select photo from gallery
- [ ] Crop/edit photo before upload
- [ ] Verify photo appears in evidence list

### Video Evidence
- [ ] Select video from gallery
- [ ] Test 60-second duration limit
- [ ] Verify video quality compression

### Document Evidence
- [ ] Upload PDF document
- [ ] Upload Word document (.doc, .docx)
- [ ] Upload Excel spreadsheet (.xls, .xlsx)
- [ ] Upload text file (.txt)
- [ ] Upload image via document picker
- [ ] Test file size validation (10MB limit)
- [ ] Test with no file selected (cancel)
- [ ] Verify document icon and metadata display

### Audio Evidence
- [ ] Request microphone permission
- [ ] Start audio recording
- [ ] Stop audio recording
- [ ] Verify recording uploads successfully
- [ ] Test recording indicator (red pulsing state)
- [ ] Verify audio file metadata

### Text Evidence
- [ ] Enter text in textarea
- [ ] Submit text evidence
- [ ] Verify text display in evidence list

### GPS Location Evidence
- [ ] Request location permission
- [ ] Capture current location
- [ ] Verify accuracy and timestamp included

### General Tests
- [ ] Verify all evidence types can be removed before submission
- [ ] Test successful submission with mixed evidence types
- [ ] Verify metadata saved correctly for all types
- [ ] Test required evidence validation
- [ ] Test mission completion with all evidence types

## Related Files
- `/app/(app)/mission/[id]/submit.tsx` - Main implementation
- `/services/missions/submissions.ts` - Upload service functions
