import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
const Quill = ReactQuill.Quill
var Font = Quill.import('formats/font')
Font.whitelist = ['Roboto', 'Raleway', 'Montserrat', 'Lato', 'Rubik']
Quill.register(Font, true)

export default function Editor({ value, onChange }) {
  /*
  NOTE: 

  The toolbar items we list here, is shown in our editor as a button/option 
  so that we can use it.
  */
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      [
        'bold',
        'italic',
        'underline',
        'align',
        'strike',
        'script',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
      ],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['clean'],
      ['image'], //add image here
      ['code-block'],
      ['video'],
    ],
  }

  return (
    <div className='content  overflow-y-auto h-[300px]'>
      <ReactQuill
        value={value}
        theme={'snow'}
        onChange={onChange}
        modules={modules}
      />
    </div>
  )
}

/*
- [ ] ->add  times new roman font in editor 
    - [ ] https://stackblitz.com/edit/react-quill?file=index.js
    - [ ] https://codesandbox.io/s/6x93pk4rp3?file=/index.js

NOTE:

-How to render react-quill contents WITHOUT the html markup ??

  ->      <div dangerouslySetInnerHTML={{__html: this.state.content}}></div>

https://stackoverflow.com/questions/40952434/how-do-i-display-the-content-of-react-quill-without-the-html-markup
    
*/
