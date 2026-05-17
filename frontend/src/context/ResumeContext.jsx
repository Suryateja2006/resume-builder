import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { updateResume as updateResumeAPI } from '../api';

const ResumeContext = createContext();

export function ResumeProvider({ children }) {
  const [template, setTemplate] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const [resumeData, setResumeData] = useState({});
  const [customSections, setCustomSections] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimerRef = useRef(null);

  // Update a field in the resume data
  const updateField = useCallback((sectionId, fieldName, value, entryIndex = null) => {
    setResumeData(prev => {
      const next = { ...prev };
      if (entryIndex !== null) {
        // Repeatable section entry
        if (!Array.isArray(next[sectionId])) next[sectionId] = [];
        const arr = [...next[sectionId]];
        if (!arr[entryIndex]) arr[entryIndex] = {};
        arr[entryIndex] = { ...arr[entryIndex], [fieldName]: value };
        next[sectionId] = arr;
      } else {
        // Single section
        if (!next[sectionId]) next[sectionId] = {};
        next[sectionId] = { ...next[sectionId], [fieldName]: value };
      }
      return next;
    });
  }, []);

  // Add entry to a repeatable section
  const addEntry = useCallback((sectionId) => {
    setResumeData(prev => {
      const next = { ...prev };
      if (!Array.isArray(next[sectionId])) next[sectionId] = [];
      next[sectionId] = [...next[sectionId], {}];
      return next;
    });
  }, []);

  // Remove entry from repeatable section
  const removeEntry = useCallback((sectionId, index) => {
    setResumeData(prev => {
      const next = { ...prev };
      if (Array.isArray(next[sectionId])) {
        next[sectionId] = next[sectionId].filter((_, i) => i !== index);
      }
      return next;
    });
  }, []);

  // Add custom section
  const addCustomSection = useCallback((section) => {
    setCustomSections(prev => [...prev, { ...section, data: section.repeatable ? [] : {} }]);
  }, []);

  // Remove custom section
  const removeCustomSection = useCallback((sectionId) => {
    setCustomSections(prev => prev.filter(s => s.sectionId !== sectionId));
  }, []);

  // Update custom section data
  const updateCustomField = useCallback((sectionId, fieldName, value, entryIndex = null) => {
    setCustomSections(prev => prev.map(s => {
      if (s.sectionId !== sectionId) return s;
      const updated = { ...s };
      if (entryIndex !== null) {
        if (!Array.isArray(updated.data)) updated.data = [];
        const arr = [...updated.data];
        if (!arr[entryIndex]) arr[entryIndex] = {};
        arr[entryIndex] = { ...arr[entryIndex], [fieldName]: value };
        updated.data = arr;
      } else {
        updated.data = { ...updated.data, [fieldName]: value };
      }
      return updated;
    }));
  }, []);

  // Autosave with debounce
  const autoSave = useCallback(async () => {
    if (!resumeId) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        await updateResumeAPI(resumeId, { data: resumeData, customSections });
        setLastSaved(new Date());
      } catch (err) {
        console.error('Autosave failed:', err);
      } finally {
        setIsSaving(false);
      }
    }, 1500);
  }, [resumeId, resumeData, customSections]);

  const value = {
    template, setTemplate,
    resumeId, setResumeId,
    resumeData, setResumeData,
    customSections, setCustomSections,
    updateField, addEntry, removeEntry,
    addCustomSection, removeCustomSection, updateCustomField,
    isSaving, lastSaved,
    autoSave
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

export const useResume = () => {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
};
