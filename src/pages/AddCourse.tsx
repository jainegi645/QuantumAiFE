
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Sidebar } from "@/components/Sidebar";
import { assets } from '../assets/assets';
import { toast } from 'react-toastify'
import Quill from 'quill';
import uniqid from 'uniqid';
import axios from 'axios'
import { AppContext } from '../context/AppContext';

const AddCourse = () => {

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { backendUrl, getToken } = useContext(AppContext)

  const [courseTitle, setCourseTitle] = useState('')
  const [courseDescription, setCourseDescription] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [image, setImage] = useState(null)
  const [chapters, setChapters] = useState([]);
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
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
            lectureId: uniqid(),
            type: 'lecture'
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
    console.log('AddCourse: handleSubmit called');
    setSubmitting(true);
    console.log('AddCourse: handleSubmit called 2');

    // ensure description is available in finally block as well
    let description = courseDescription;

    try {
      if (!image) {
        toast.error('Thumbnail Not Selected');
        console.log('AddCourse: handleSubmit called 3 - no image');
        setSubmitting(false);
        return;
      }

      description = quillRef?.current?.root?.innerHTML ?? courseDescription;
      console.log('AddCourse: handleSubmit called 3 b - description prepared');
      const courseData = {
        courseTitle,
        courseDescription: description,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      };

      const formData = new FormData();
      formData.append('courseData', JSON.stringify(courseData));
      console.log('AddCourse: handleSubmit called 4 - courseData appended');
      formData.append('image', image);
      console.log('AddCourse: handleSubmit called 5 - formData prepared');

      const token = getToken ? await getToken() : null;
      console.log('AddCourse: posting to', backendUrl + '/api/courses', { token });

      const { data } = await axios.post(backendUrl + '/api/courses', formData, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });

      console.log('AddCourse: response', data);

      if (data?.success) {
        toast.success(data.message || 'Course added');
        // Clear form
        setCourseTitle('');
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapters([]);
        if (quillRef?.current?.root) quillRef.current.root.innerHTML = '';
        // Refresh page to show new data
        window.location.reload();
      } else {
        toast.error(data?.message || 'Failed to add course');
      }
    } catch (error: any) {
      console.error('AddCourse: submit error', error);
      const msg = error?.response?.data?.message || error?.message || 'Submission failed';
      toast.error(msg);
    } finally {
        // Backend Course model expects imageUrl as a string. Many backends
        // don't accept multipart here (415). Send JSON with imageUrl (empty
        // or pre-uploaded URL) unless you have a dedicated upload endpoint.
        const token = getToken ? await getToken() : null;
        console.log('AddCourse: posting JSON to', backendUrl + '/api/courses', { token });

        // If you have an upload endpoint, upload the file first and set imageUrl
        // For now we send an empty imageUrl; backend should accept and persist.
        const payload = {
          title: courseTitle,
          description: description,
          price: Number(coursePrice),
          discount: Number(discount),
          imageUrl: '',
          courseContent: chapters,
        };

        const { data } = await axios.post(backendUrl + '/api/courses', payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
      }
  }

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

            <div className='flex items-center justify-between flex-wrap'>
              <div className='flex flex-col gap-1'>
                <p><b>Course Price</b></p>
                <input onChange={e => setCoursePrice(Number(e.target.value))} value={coursePrice} type="number" placeholder='0' className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500' required />
              </ div>

              <div className='flex md:flex-row flex-col items-center gap-3'>
                <p><b>Course Thumbnail</b></p>
                <label htmlFor='thumbnailImage' className='flex items-center gap-3'>
                  <img src={assets.file_upload_icon} alt="" className='p-3 bg-blue-500 rounded' />
                  <input type="file" id='thumbnailImage' onChange={e => setImage(e.target.files[0])} accept="image/*" hidden />
                  <img className='max-h-10' src={image ? URL.createObjectURL(image) : ''} alt="" />
                </label>
              </div>
            </div>

            <div className='flex flex-col gap-1'>
              <p><b>Discount</b> %</p>
              <input onChange={e => setDiscount(Number(e.target.value))} value={discount} type="number" placeholder='0' min={0} max={100} className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500' required />
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
                      <p>Lecture URL</p>
                      <input
                        type="text"
                        className="mt-1 block w-full border rounded py-1 px-2"
                        value={lectureDetails.lectureUrl}
                        onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2 my-4">
                      <p>Is Preview Free?</p>
                      <input
                        type="checkbox" className='mt-1 scale-125'
                        checked={lectureDetails.isPreviewFree}
                        onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                      />
                    </div>
                    <button type='button' className="w-full bg-blue-400 text-white px-4 py-2 rounded" onClick={addLecture}>Add</button>
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

