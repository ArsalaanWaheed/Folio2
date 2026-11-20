'use client';

import { createContext, useContext, useId, useState } from 'react';
import { defaultPortfolio, icons, layouts, placements, newBlock, type PortfolioContent } from '../../lib/portfolio-content';
import { publish } from './actions';

type Field = string | boolean | Field[] | { [key: string]: Field };
type Group = keyof PortfolioContent;
const groups: [Group, string][] = [
  ['site', 'Site settings'], ['hero', 'Hero'], ['about', 'About'], ['research', 'Research'],
  ['education', 'Education'], ['skills', 'Skills'], ['experience', 'Experience'], ['contact', 'Contact'],
  ['appearance', 'Appearance'], ['navigation', 'Navigation'], ['sections', 'Section order'], ['blocks', 'Custom blocks'],
];

const friendlyNames: Record<string, string> = {
  urduLine: 'Urdu verse', urduTranslation: 'English translation', portraitUrl: 'Portrait image', portraitAlt: 'Portrait description', anchor: 'Navigation anchor (optional)', placement: 'Place before', paper: 'Page background', ink: 'Main text', imageUrl: 'Block image', imageAlt: 'Image description', linkUrl: 'Link URL',
  href: 'Destination URL or section anchor', linkedin: 'LinkedIn URL', linkedinLabel: 'LinkedIn link label',
};
const labelFor = (key: string) => friendlyNames[key] || (key.charAt(0).toUpperCase() + key.slice(1).replace(/[A-Z]/g, character => ' ' + character.toLowerCase()));
const multiline = new Set(['description', 'socialDescription', 'introduction', 'biography', 'background', 'body', 'note']);

function emptyItem(template: Field, key = ''): Field {
  if (Array.isArray(template)) return [];
  if (typeof template === 'object') return Object.fromEntries(Object.entries(template).map(([name, value]) => [name, emptyItem(value, name)]));
  return typeof template === 'string' && !['icon', 'layout', 'placement'].includes(key) ? '' : template;
}

const UploadContext = createContext<(busy: boolean) => void>(() => undefined);

function ImageField({ name, value, onChange }: { name: string; value: string; onChange: (value: string) => void }) {
  const id = useId();
  const setUploading = useContext(UploadContext);
  const [status, setStatus] = useState('');

  async function upload(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      setStatus('Choose an image smaller than 5 MB.');
      return;
    }
    setUploading(true);
    setStatus('Uploading…');
    try {
      const response = await fetch('/admin/upload', { method: 'POST', body: file });
      const result = await response.json();
      if (!response.ok || typeof result.url !== 'string') {
        setStatus(result.error || 'Upload failed. Try again.');
        return;
      }
      onChange(result.url);
      setStatus('Image uploaded. Publish changes to show it on the portfolio.');
    } catch {
      setStatus('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  }

  return <div className="admin-field admin-image-field">
    <label htmlFor={id}>{labelFor(name)}</label>
    {value && <>
      {/* eslint-disable-next-line @next/next/no-img-element -- Preview also supports previously saved external images. */}
      <img src={value} alt="" className="admin-image-preview" />
      <button suppressHydrationWarning type="button" onClick={() => { onChange(''); setStatus('Image removed from draft.'); }}>Remove image</button>
    </>}
    <input suppressHydrationWarning id={id} type="file" accept="image/jpeg,image/png,image/webp,image/avif" aria-describedby={id + '-help'} onChange={event => {
      const file = event.currentTarget.files?.[0];
      event.currentTarget.value = '';
      if (file) void upload(file);
    }} />
    <small id={id + '-help'}>JPEG, PNG, WebP, or AVIF. Maximum 5 MB.</small>
    {status && <p role="status">{status}</p>}
  </div>;
}

function ContentField({ name, value, template, onChange }: { name: string; value: Field; template: Field; onChange: (value: Field) => void }) {
  const id = useId();
  if (Array.isArray(value)) {
    const itemTemplate = name === 'blocks' ? newBlock : (template as Field[])[0];
    const sections = name === 'sections';
    function move(index: number, offset: number) {
      const next = [...value as Field[]];
      [next[index], next[index + offset]] = [next[index + offset], next[index]];
      onChange(next);
    }
    return <fieldset className="admin-list">
      <legend>{labelFor(name)}</legend>
      {value.map((item, index) => {
        const details = typeof item === 'object' && !Array.isArray(item) ? item : null;
        const itemLabel = details?.title || details?.label || details?.id || (typeof item === 'string' ? item : '') || 'Item ' + (index + 1);
        return <div className="admin-row" key={index}>
          <div className="admin-row-header">
            <strong>{typeof itemLabel === 'string' && itemLabel.slice(0, 90)}</strong>
            <div className="admin-controls">
              <button suppressHydrationWarning type="button" aria-label={'Move item ' + (index + 1) + ' up'} disabled={index === 0} onClick={() => move(index, -1)}>↑</button>
              <button suppressHydrationWarning type="button" aria-label={'Move item ' + (index + 1) + ' down'} disabled={index === value.length - 1} onClick={() => move(index, 1)}>↓</button>
              {!sections && <button suppressHydrationWarning type="button" aria-label={'Remove item ' + (index + 1)} onClick={() => onChange(value.filter((_, position) => position !== index))}>Remove</button>}
            </div>
          </div>
          <ContentField name={typeof item === 'string' ? 'text' : name} value={item} template={itemTemplate}
            onChange={next => onChange(value.map((current, position) => position === index ? next : current))} />
        </div>;
      })}
      {!sections && <button suppressHydrationWarning type="button" disabled={value.length >= 60} onClick={() => onChange([...value, emptyItem(itemTemplate)])}>
        {name === 'blocks' ? 'Add block' : 'Add item'}
      </button>}
    </fieldset>;
  }
  if (typeof value === 'object') {
    return <div className="admin-fields">
      {Object.entries(value).filter(([key]) => key !== 'id').map(([key, field]) => (
        <ContentField key={key} name={key} value={field} template={(template as Record<string, Field>)[key]}
          onChange={next => onChange({ ...value, [key]: next })} />
      ))}
    </div>;
  }
  if (typeof value === 'boolean') {
    return <label className="admin-toggle"><input suppressHydrationWarning type="checkbox" checked={value} onChange={event => onChange(event.target.checked)} /> Show on portfolio</label>;
  }
  if (name === 'portraitUrl' || name === 'imageUrl') return <ImageField name={name} value={value} onChange={onChange} />;
  const options = name === 'icon' ? icons : name === 'layout' ? layouts : name === 'placement' ? placements : null;
  return <div className="admin-field">
    <label htmlFor={id}>{labelFor(name)}</label>
    {options ? <select id={id} value={value} onChange={event => onChange(event.target.value)}>
      {options.map(option => <option key={option} value={option}>{option === 'end' ? 'End of page' : labelFor(option)}</option>)}
    </select> : multiline.has(name) ? <textarea rows={3} id={id} value={value} maxLength={12000} onChange={event => onChange(event.target.value)} />
      : <input suppressHydrationWarning id={id} type={['accent', 'dark', 'paper', 'ink', 'blush', 'border', 'heroGlow', 'contactTint'].includes(name) ? 'color' : 'text'} value={value} maxLength={12000} onChange={event => onChange(event.target.value)} />}
  </div>;
}

export default function Editor({ initialContent, initialRevision }: { initialContent: PortfolioContent; initialRevision: string }) {
  const [content, setContent] = useState(initialContent);
  const [savedContent, setSavedContent] = useState(initialContent);
  const [revision, setRevision] = useState(initialRevision);
  const [group, setGroup] = useState<Group>('site');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const dirty = content !== savedContent;

  async function save() {
    setBusy(true);
    setMessage('');
    try {
      const result = await publish(content, revision);
      if (result.revision) {
        setRevision(result.revision);
        setSavedContent(content);
        setMessage('Changes published.');
      } else {
        setMessage(result.error || 'Publishing failed.');
      }
    } catch {
      setMessage('Could not publish changes. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return <div className="admin-workspace">
    <nav aria-label="Editor sections" className="admin-sidebar">
      {groups.map(([id, label]) => <button suppressHydrationWarning key={id} type="button" disabled={uploading} aria-current={group === id ? 'true' : undefined} onClick={() => setGroup(id)}>{label}</button>)}
    </nav>
    <section className="admin-panel" aria-labelledby="editor-heading">
      <div className="admin-panel-header">
        <h2 id="editor-heading" className="serif">{groups.find(([id]) => id === group)?.[1]}</h2>
        <button suppressHydrationWarning className="admin-primary" type="button" disabled={busy || uploading || !dirty} onClick={save}>{busy ? 'Publishing…' : 'Publish changes'}</button>
      </div>
      <p role="status">{message || (dirty ? 'Unpublished changes' : 'All changes published')}</p>
      {group === 'blocks' && <p>Choose where a block appears. Set a navigation anchor such as <code>publications</code>, then link to <code>#publications</code> from Navigation.</p>}
      {group === 'navigation' && <p>Use a section anchor such as <code>#about</code> or a full URL.</p>}
      <UploadContext.Provider value={setUploading}>
      <fieldset className="admin-editable" disabled={busy || uploading}>
        <ContentField key={group} name={group} value={content[group]} template={defaultPortfolio[group]}
          onChange={value => { setMessage(''); setContent(current => ({ ...current, [group]: value })); }} />
      </fieldset>
      </UploadContext.Provider>
    </section>
  </div>;
}
