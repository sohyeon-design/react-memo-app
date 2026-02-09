import React, { useState, useEffect } from 'react';
import './App.css';
import MemoItem from './components/MemoItem';
import SearchBar from './components/SearchBar';

function App() {
  const [memos, setMemos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [nextId, setNextId] = useState(1);

  // 로컬 스토리지에서 메모 불러오기
  useEffect(() => {
    const savedMemos = localStorage.getItem('memos');
    const savedNextId = localStorage.getItem('nextId');
    
    if (savedMemos) {
      setMemos(JSON.parse(savedMemos));
    }
    if (savedNextId) {
      setNextId(parseInt(savedNextId));
    }
  }, []);

  // 메모가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('memos', JSON.stringify(memos));
    localStorage.setItem('nextId', nextId.toString());
  }, [memos, nextId]);

  // 새 메모 추가
  const handleAddMemo = () => {
    // 현재 수정 중인 메모가 있으면 먼저 처리
    const editingMemo = memos.find(memo => memo.isEditing);
    
    let updatedMemos = [...memos];
    
    if (editingMemo) {
      // 수정 중인 메모의 내용이 비어있으면 삭제
      if (editingMemo.content.trim() === '') {
        updatedMemos = memos.filter(memo => memo.id !== editingMemo.id);
      } else {
        // 내용이 있으면 자동 저장
        updatedMemos = memos.map(memo => 
          memo.id === editingMemo.id ? { ...memo, isEditing: false } : memo
        );
      }
    }
    
    // 새 메모 추가
    const newMemo = {
      id: nextId,
      content: '',
      isEditing: true,
      createdAt: new Date().toISOString(),
    };
    
    setMemos([newMemo, ...updatedMemos]);
    setNextId(nextId + 1);
  };

  // 메모 수정 모드 전환
  const handleEditMemo = (id) => {
    setMemos(memos.map(memo => 
      memo.id === id ? { ...memo, isEditing: true } : memo
    ));
  };

  // 메모 내용 변경 (실시간 업데이트)
  const handleChangeMemo = (id, content) => {
    setMemos(memos.map(memo => 
      memo.id === id ? { ...memo, content } : memo
    ));
  };

  // 메모 저장
  const handleSaveMemo = (id, content) => {
    setMemos(memos.map(memo => 
      memo.id === id ? { ...memo, content, isEditing: false } : memo
    ));
  };

  // 메모 삭제
  const handleDeleteMemo = (id) => {
    if (window.confirm('정말로 이 메모를 삭제하시겠습니까?')) {
      setMemos(memos.filter(memo => memo.id !== id));
    }
  };

  // 검색된 메모 필터링
  const filteredMemos = memos.filter(memo =>
    memo.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>📝 메모 앱</h1>
          <button className="btn-add" onClick={handleAddMemo}>
            <span className="btn-icon">+</span> 새 메모
          </button>
        </header>

        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <div className="memo-list">
          {filteredMemos.length === 0 ? (
            <div className="empty-state">
              {searchTerm ? '검색 결과가 없습니다.' : '메모가 없습니다. 새 메모를 추가해보세요!'}
            </div>
          ) : (
            filteredMemos.map(memo => (
              <MemoItem
                key={memo.id}
                memo={memo}
                onEdit={handleEditMemo}
                onSave={handleSaveMemo}
                onDelete={handleDeleteMemo}
                onChange={handleChangeMemo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
