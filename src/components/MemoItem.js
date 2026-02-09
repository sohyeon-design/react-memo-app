import React, { useState, useEffect, useRef } from 'react';
import './MemoItem.css';

function MemoItem({ memo, onEdit, onSave, onDelete, onChange }) {
  const [content, setContent] = useState(memo.content);
  const textareaRef = useRef(null);

  // memo.content가 변경되면 로컬 state도 업데이트
  useEffect(() => {
    setContent(memo.content);
  }, [memo.content]);

  // 수정 모드일 때 textarea에 포커스
  useEffect(() => {
    if (memo.isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [memo.isEditing]);

  // 내용 변경 처리
  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    // 부모 컴포넌트에 실시간으로 변경사항 전달
    onChange(memo.id, newContent);
  };

  // 저장 처리
  const handleSave = () => {
    if (content.trim() === '') {
      alert('메모 내용을 입력해주세요.');
      return;
    }
    onSave(memo.id, content);
  };

  // 취소 처리 (내용이 비어있으면 삭제)
  const handleCancel = () => {
    if (memo.content === '' && content === '') {
      onDelete(memo.id);
    } else {
      setContent(memo.content);
      onSave(memo.id, memo.content);
    }
  };

  return (
    <div className={`memo-item ${memo.isEditing ? 'editing' : ''}`}>
      {memo.isEditing ? (
        <div className="memo-edit-mode">
          <textarea
            ref={textareaRef}
            className="memo-textarea"
            value={content}
            onChange={handleChange}
            placeholder="메모를 입력하세요..."
            rows={5}
          />
          <div className="memo-actions">
            <button className="btn btn-save" onClick={handleSave}>
              💾 저장
            </button>
            <button className="btn btn-cancel" onClick={handleCancel}>
              ✖️ 취소
            </button>
          </div>
        </div>
      ) : (
        <div className="memo-view-mode">
          <div className="memo-content">{memo.content}</div>
          <div className="memo-footer">
            <span className="memo-date">
              {new Date(memo.createdAt).toLocaleString('ko-KR')}
            </span>
            <div className="memo-actions">
              <button className="btn btn-edit" onClick={() => onEdit(memo.id)}>
                ✏️ 수정
              </button>
              <button className="btn btn-delete" onClick={() => onDelete(memo.id)}>
                🗑️ 삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemoItem;
