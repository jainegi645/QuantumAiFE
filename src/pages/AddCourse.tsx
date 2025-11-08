
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Sidebar } from "@/components/Sidebar";
import { assets } from '../assets/assets';
import { toast } from 'react-toastify'
import Quill from 'quill';
import uniqid from 'uniqid';
import axios from 'axios'
import { apiService } from '@/api/apiCalling';
import { endpoints } from '@/api/endpoints';
import { AppContext } from '../context/AppContext';

const AddCourse = () => {

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { backendUrl, getToken } = useContext(AppContext)
  // (Video uploads removed) client-side upload-size guard removed per project change request.

  const [courseTitle, setCourseTitle] = useState('')
  const [courseDescription, setCourseDescription] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [chapters, setChapters] = useState([]);
  const [isPaid, setIsPaid] = useState(true)
  const [category, setCategory] = useState('')
  const [duration, setDuration] = useState('')
  const [difficultyLevel, setDifficultyLevel] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const categories = ['Web Development', 'Mobile Development', 'Data Science']
  const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced']
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  });

  const [showNotesPopup, setShowNotesPopup] = useState(false);
  const [notesDetails, setNotesDetails] = useState({
    notesTitle: '',
    attachment: null,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChapter = (action: 'add' | 'remove' | 'toggle', chapterId?: string) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:');
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === 'remove' && chapterId) {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === 'toggle' && chapterId) {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
        )
      );
    }
  };

  const handleLecture = (action: 'add' | 'remove', chapterId: string, lectureIndex?: number) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            if (typeof lectureIndex === 'number') {
              chapter.chapterContent.splice(lectureIndex, 1);
            }
          }
          return chapter;
        })
      );
    }
  };

  const addLecture = () => {
    // Video upload removed: accept a manual URL (lectureUrl) or leave empty.
    const finalLectureUrl = lectureDetails.lectureUrl || '';

    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureUrl: finalLectureUrl,
            lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
            lectureId: uniqid(),
            type: 'lecture',
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );

    setShowPopup(false);
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    });
  };

  const addNotes = () => {
    if (!notesDetails.attachment) {
      toast.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', notesDetails.attachment);

    // Create object URL for local preview
    const fileUrl = URL.createObjectURL(notesDetails.attachment);

    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newNotes = {
            notesTitle: notesDetails.notesTitle,
            fileName: notesDetails.attachment.name,
            fileUrl: fileUrl,
            notesOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].notesOrder + 1 : 1,
            notesId: uniqid(),
            type: 'notes'
          };
          chapter.chapterContent.push(newNotes);
        }
        return chapter;
      })
    );
    setShowNotesPopup(false);
    setNotesDetails({
      notesTitle: '',
      attachment: null,
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      console.log('Starting course submission...');

      // Validate required fields
      if (!courseTitle) {
        toast.error('Please enter a course title');
        setSubmitting(false);
        return;
      }

      if (!thumbnailFile) {
        toast.error('Please select a thumbnail image');
        setSubmitting(false);
        return;
      }

      if (isPaid && (!coursePrice || coursePrice <= 0)) {
        toast.error('Please enter a valid course price');
        setSubmitting(false);
        return;
      }

      if (!category) {
        toast.error('Please select a category');
        setSubmitting(false);
        return;
      }

      const description = quillRef?.current?.root?.innerHTML ?? courseDescription;

      // final price calculation
      // Convert to proper types as per backend model
      const priceNum = Number(coursePrice) || 0;
      const discountNum = Number(discount) || 0;
      const finalPrice = Math.max(0, Math.round((priceNum * (1 - discountNum / 100)) * 100) / 100);

      // First create the course without thumbnail
      const initialPayload = {
        title: courseTitle,
        description: description,
        price: priceNum,
        discount: discountNum,
        finalPrice: finalPrice,
        imageUrl: '', // Will be updated after thumbnail upload
        courseContent: chapters,
        paid: isPaid,
        category: category,
        duration: duration.toString(),
        level: difficultyLevel,
        tags: tags,
      };

      console.log('Course payload:', initialPayload);
      
      const token = getToken ? await getToken() : null;
      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        setSubmitting(false);
        return;
      }

      try {
        console.log('Making POST request to:', backendUrl + '/api/courses');
        const { data: courseData } = await axios.post(backendUrl + '/api/courses', initialPayload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log('Course creation response:', courseData);

        if (courseData?.id) {
          // Now upload the thumbnail with the course ID using apiService helper
          console.log('Uploading thumbnail for course:', courseData.id);
          try {
            const uploadData = await apiService.uploadFile(endpoints.uploadCourseThumbnail, thumbnailFile, [courseData.id], {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log('Thumbnail upload response:', uploadData);

          if (uploadData?.imageUrl) {
            // Update the course with the thumbnail URL (use PATCH: backend expects partial update)
            await apiService.patch(endpoints.course, { imageUrl: uploadData.imageUrl }, [courseData.id], {
              headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
              },
            });
            toast.success('Course and thumbnail uploaded successfully');
          } else {
            console.warn('Thumbnail upload succeeded but no URL in response:', uploadData);
            toast.warn('Course created but thumbnail URL not received from server');
          }

          // Optionally fetch server course or perform other post-create actions here.
          toast.success('Course created successfully');

          // Clear form
          setCourseTitle('');
          setCoursePrice(0);
          setDiscount(0);
          setThumbnailFile(null);
          setThumbnailUrl('');
          setChapters([]);
          setTags([]);
          if (quillRef?.current?.root) {
            quillRef.current.root.innerHTML = '';
          }
      
        //  else {
        //   toast.error(courseData?.message || 'Failed to add course');
        // }
      } catch (error: any) {
        console.error('AddCourse: submit error', error);
        console.error('Error details:', {
          response: error?.response?.data,
          status: error?.response?.status,
          message: error?.message
        });
        const msg = error?.response?.data?.message || error?.message || 'Submission failed';
        toast.error(msg);
      }
      }
    
      } catch (outerError: any) {
      console.error('Unexpected error in submit flow', outerError);
      toast.error(outerError?.message || 'Submission failed');
    }
  } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // Initiate Quill only once. Nothing 
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
    }
  }, []);

  useEffect(() => {
    console.log(chapters);
  }, [chapters]);

  // Effect to handle price and discount when course type changes
  useEffect(() => {
    if (!isPaid) {
      setCoursePrice(0);
      setDiscount(0);
    }
  }, [isPaid]);

  return (
    <div className='h-screen overflow-scroll md:p-8 p-4 pt-8 pb-0'>
      <div className='flex w-full items-start gap-6'>
        <Sidebar />
        <div className='flex-1 flex flex-col items-start justify-between'>
          
          <form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-md w-full text-gray-500 ml-auto mr-auto'>
            <div className='flex flex-col gap-1'>
              <p><b>Course Title</b></p>
              <input onChange={e => setCourseTitle(e.target.value)} value={courseTitle} type="text" placeholder='Type here' className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500' required />
            </div>

            <div className='flex flex-col gap-1'>
              <p><b>Course Description</b></p>
              <textarea
                onChange={e => setCourseDescription(e.target.value)}
                value={courseDescription}
                placeholder='Type here'
                rows={6}
                className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500 resize-vertical'
                required
              />
              {/* <div ref={editorRef}></div> */}
            </div>

            <div className='flex items-center justify-between flex-wrap gap-4 mb-2'>
              <div className='flex flex-col gap-1'>
                <p><b>Course Type</b></p>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={isPaid}
                      onChange={() => setIsPaid(true)}
                      className="scale-125"
                      name="courseType"
                      required
                    />
                    Paid
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={!isPaid}
                      onChange={() => setIsPaid(false)}
                      className="scale-125"
                      name="courseType"
                      required
                    />
                    Free
                  </label>
                </div>
              </div>

              <div className='flex md:flex-row flex-col items-center gap-3'>
                <p><b>Course Thumbnail</b></p>
                <label htmlFor='thumbnailImage' className='flex items-center gap-3'>
                  <img src={assets.file_upload_icon} alt="" className='p-3 bg-blue-500 rounded' />
                  <input 
                    type="file" 
                    id='thumbnailImage' 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      try {
                        // Store the file for later upload
                        setThumbnailFile(file);
                        
                        // Create a temporary URL for preview
                        const previewUrl = URL.createObjectURL(file);
                        setThumbnailUrl(previewUrl);
                        setThumbnailFile(file);
                        toast.success('Thumbnail selected successfully');
                      } catch (error) {
                        console.error('Error processing thumbnail:', error);
                        toast.error('Failed to process thumbnail');
                        setThumbnailFile(null);
                        setThumbnailUrl('');
                      }
                    }} 
                    accept="image/*" 
                    required 
                  />
                  <img className='max-h-10' src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : ''} alt="" />
                </label>
              </div>
            </div>

            {isPaid && (
              <div className='flex items-center gap-10 flex-wrap'>
                <div className='flex flex-col gap-1'>
                  <p><b>Course Price</b></p>
                  <input 
                    onChange={e => setCoursePrice(Number(e.target.value))} 
                    value={coursePrice} 
                    type="number" 
                    placeholder='0' 
                    className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500' 
                    required={isPaid}
                    min="0"
                  />
                </div>

                <div className='flex flex-col gap-1'>
                  <p><b>Discount</b> %</p>
                  <input 
                    onChange={e => setDiscount(Number(e.target.value))} 
                    value={discount} 
                    type="number" 
                    placeholder='0' 
                    min={0} 
                    max={100} 
                    className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500' 
                    required={isPaid}
                  />
                </div>
              </div>
            )}

            <div className='flex flex-col gap-1'>
              <p><b>Category</b></p>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500'
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className='flex flex-col gap-1'>
              <p><b>Duration</b></p>
              <input
                type="text"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="e.g., 2h 30m"
                className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500'
                required
              />
              <span className="text-sm text-gray-500">Format: 2h 30m, 45m, etc.</span>
            </div>

            <div className='flex flex-col gap-1'>
              <p><b>Tags</b></p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div key={index} className="bg-blue-100 px-2 py-1 rounded flex items-center gap-2">
                    {tag}
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add tag and press Enter"
                className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500 mt-2'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.target as HTMLInputElement;
                    const value = input.value.trim();
                    if (value && !tags.includes(value)) {
                      setTags([...tags, value]);
                      input.value = '';
                    }
                  }
                }}
              />
            </div>

            <div className='flex flex-col gap-1'>
              <p><b>Difficulty Level</b></p>
              <select 
                value={difficultyLevel}
                onChange={e => setDifficultyLevel(e.target.value)}
                className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500'
                required
              >
                <option value="">Select Difficulty Level</option>
                {difficultyLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Adding Chapters & Lectures */}
            <div>
              {chapters.map((chapter, chapterIndex) => (
                <div key={chapterIndex} className="bg-white border rounded-lg mb-4">
                  <div className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center">
                      <img className={`mr-2 cursor-pointer transition-all ${chapter.collapsed && "-rotate-90"} `} onClick={() => handleChapter('toggle', chapter.chapterId)} src={assets.dropdown_icon} width={14} alt="" />
                      <span className="font-semibold">{chapterIndex + 1} {chapter.chapterTitle}</span>
                    </div>
                    <span className="text-gray-500">{chapter.chapterContent.length} Lectures</span>
                    <img onClick={() => handleChapter('remove', chapter.chapterId)} src={assets.cross_icon} alt="" className='cursor-pointer' />
                  </div>
                  {!chapter.collapsed && (
                    <div className="p-4">
                      {chapter.chapterContent.map((lecture, lectureIndex) => (
                        <div key={lectureIndex} className="flex justify-between items-center mb-2">
                          {lecture.type === 'lecture' ? (
                            <>
                              <span>{lectureIndex + 1} {lecture.lectureTitle} - {lecture.lectureDuration} mins - <a href={lecture.lectureUrl} target="_blank" className="text-blue-500">Link</a> - {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}</span>
                              <img onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)} src={assets.cross_icon} alt="" className='cursor-pointer' />
                            </>
                          ) : (
                            <>
                              <span>{lectureIndex + 1} {lecture.notesTitle} - <a href={lecture.fileUrl} target="_blank" className="text-blue-500">{lecture.fileName}</a></span>
                              <img onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)} src={assets.cross_icon} alt="" className='cursor-pointer' />
                            </>
                          )}
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <div className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2" onClick={() => handleLecture('add', chapter.chapterId)}>
                          + Add Lecture
                        </div>
                        <div className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2" onClick={() => { setCurrentChapterId(chapter.chapterId); setShowNotesPopup(true); }}>
                          + Add Notes
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div className="flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer" onClick={() => handleChapter('add')}>
                + Add Chapter
              </div>

              {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                  <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-80">
                    <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>
                    <div className="mb-2">
                      <p>Lecture Title</p>
                      <input
                        type="text"
                        className="mt-1 block w-full border rounded py-1 px-2"
                        value={lectureDetails.lectureTitle}
                        onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <p>Duration (minutes)</p>
                      <input
                        type="number"
                        className="mt-1 block w-full border rounded py-1 px-2"
                        value={lectureDetails.lectureDuration}
                        onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <p>Lecture Video</p>
                      <input
                        type="file"
                        accept="video/*"
                        className="mt-1 block w-full border rounded py-1 px-2"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setLectureDetails({ ...lectureDetails, videoFile: file });
                          }
                        }}
                      />
                      {lectureDetails.lectureUrl && (
                        <p className="text-sm text-green-600 mt-1">Video will be uploaded when course is created</p>
                      )}
                    </div>
                    <div className="flex gap-2 my-4">
                      <p>Is Preview Free?</p>
                      <input
                        type="checkbox" className='mt-1 scale-125'
                        checked={lectureDetails.isPreviewFree}
                        onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                      />
                    </div>
                    <button type='button' className="w-full bg-blue-400 text-white px-4 py-2 rounded" onClick={addLecture}>
                      Add
                    </button>
                    <img onClick={() => setShowPopup(false)} src={assets.cross_icon} className='absolute top-4 right-4 w-4 cursor-pointer' alt="" />
                  </div>
                </div>
              )}

              {showNotesPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                  <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-80">
                    <h2 className="text-lg font-semibold mb-4">Add Notes</h2>
                    <div className="mb-4">
                      <p>Notes Title</p>
                      <input
                        type="text"
                        className="mt-1 block w-full border rounded py-1 px-2"
                        value={notesDetails.notesTitle}
                        onChange={(e) => setNotesDetails({ ...notesDetails, notesTitle: e.target.value })}
                      />
                    </div>
                    <div className="mb-4">
                      <p>Upload File</p>
                      <label className="flex items-center gap-2 mt-1 cursor-pointer">
                        <div className="bg-blue-50 text-blue-500 px-4 py-2 rounded">
                          Choose File
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => setNotesDetails({ ...notesDetails, attachment: e.target.files[0] })}
                        />
                        <span className="text-sm text-gray-500">
                          {notesDetails.attachment ? notesDetails.attachment.name : 'No file chosen'}
                        </span>
                      </label>
                    </div>
                    <button 
                      type='button' 
                      className="w-full bg-blue-400 text-white px-4 py-2 rounded" 
                      onClick={addNotes}
                    >
                      Add
                    </button>
                    <img onClick={() => setShowNotesPopup(false)} src={assets.cross_icon} className='absolute top-4 right-4 w-4 cursor-pointer' alt="" />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className={"bg-black text-white w-max py-2.5 px-8 rounded my-4 " + (submitting ? 'opacity-60 cursor-not-allowed' : '')}
              disabled={submitting}
            >
              {submitting ? 'Adding...' : 'ADD'}
            </button>
          </form>
        </div>
        </div>
      </div>
  );
};

export default AddCourse;