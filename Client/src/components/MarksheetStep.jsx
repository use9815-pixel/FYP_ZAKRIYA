import React from 'react';

function MarksheetStep({ file, onFileChange }) {
  const isImage = file && file.type && file.type.startsWith('image/');
  const previewUrl = isImage ? URL.createObjectURL(file) : null;

  return (
    <section className="step-panel fade-in">
      <p className="step-kicker">Step 4 of 4</p>
      <h2>Upload Your Marksheet</h2>
      <p className="step-description">Our AI will scan it to identify your strong subjects.</p>

      <label className="upload-zone" htmlFor="marksheet-file">
        <input
          id="marksheet-file"
          type="file"
          accept=".jpg,.jpeg,.png,.pdf,.txt,.docx"
          onChange={(event) => onFileChange(event.target.files?.[0] || null)}
        />
        <svg className="upload-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8.5 7.5L12 3l3.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 21h14a2 2 0 0 0 2-2V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
        </svg>

        <span className="upload-title">Click or drop to upload</span>
        <small>JPG, PNG or PDF - photo or export of your marksheet</small>
      </label>

      {isImage && previewUrl ? (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img src={previewUrl} alt="marksheet preview" className="preview-thumb slide-up" />
      ) : null}

      <p className="file-name">
        {file ? `Selected: ${file.name}` : 'No marksheet selected yet.'}
      </p>
    </section>
  );
}

export default MarksheetStep;
