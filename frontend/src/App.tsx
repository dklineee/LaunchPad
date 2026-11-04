import {useEffect, useState} from 'react';
import {Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField} from '@mui/material';

type Environment = {name:string; created:number; expires:number; readyAt:number};
const hour = 3_600_000;

export default function App() {
  const [environments,setEnvironments] = useState<Environment[]>([]);
  const [now,setNow] = useState(Date.now());
  const [creating,setCreating] = useState(false);
  const [name,setName] = useState('');
  const [duration,setDuration] = useState(4);
  const [query,setQuery] = useState('');
  const [removing,setRemoving] = useState<string|null>(null);
  const [preview,setPreview] = useState<Environment|null>(null);
  const [notice,setNotice] = useState('');
  useEffect(()=>{const timer=window.setInterval(()=>setNow(Date.now()),1000);return ()=>clearInterval(timer)},[]);
  const valid = /^[a-z][a-z0-9-]{0,29}$/.test(name) && !name.endsWith('-');
  const duplicate = environments.some(e=>e.name===name);
  const error = name && (!valid ? 'Use 1–30 lowercase letters, numbers or hyphens. Start with a letter and end with a letter or number.' : duplicate ? 'This environment name is already in use.' : '');
  const status = (e:Environment)=>now>=e.expires?'Expired':now<e.readyAt?'Provisioning':'Running';
  function create() {
    if (!valid || duplicate) return;
    const created=Date.now();
    setEnvironments(previous=>[...previous,{name,created,expires:created+duration*hour,readyAt:created+3000}]);
    setCreating(false);setName('');setNotice('Demo environment created. No Kubernetes resources were provisioned.');
  }
  return <div className="shell">
    <aside className="sidebar">
      <a className="brand" href="./"><span className="brand-icon">↗</span> LaunchPad<span className="beta">LAB</span></a>
      <div className="nav-label">WORKSPACE</div>
      <div className="nav-item">▦ <span>Environments</span><span className="count">{environments.length}</span></div>
      <div className="sidebar-bottom"><span className="dot"/> Local playground<p>Build. Experiment. Start again.</p></div>
    </aside>
    <main>
      <header><span>Workspace <span className="slash">/</span> <strong>Environments</strong></span><Chip size="small" label="Demo mode" variant="outlined"/></header>
      <section className="content">
        <div className="heading"><div><div className="eyebrow">YOUR DEVELOPER WORKSPACE</div><h1>Ideas need room to run.</h1><p>Launch a sandbox. Try something new. Make it yours.</p></div><Button variant="contained" size="large" onClick={()=>setCreating(true)}>＋ Create environment</Button></div>
        <Alert severity="info" className="demo-banner">Frontend preview · Actions are simulated in memory and reset on refresh. No cluster is connected.</Alert>
        <div className="stats">
          {[['Environments',environments.length,'Your personal sandboxes'],['Running',environments.filter(e=>status(e)==='Running').length,'Ready to explore'],['Provisioning',environments.filter(e=>status(e)==='Provisioning').length,'Getting things ready']].map(([label,value,caption])=><article className="stat" key={label}><span>{label}</span><strong>{value}</strong><small>{caption}</small></article>)}
        </div>
        <section className="panel">
          <div className="panel-heading"><div><h2>Your environments</h2><p>A little space for your next big idea.</p></div><TextField label="Search environments" size="small" value={query} onChange={e=>setQuery(e.target.value)}/></div>
          {environments.length===0?<div className="empty"><div className="empty-icon">◇</div><h3>Your launch starts here</h3><p>Create your first environment from the web app template.<br/>We’ll simulate the setup so you can explore the workflow.</p><Button variant="outlined" onClick={()=>setCreating(true)}>Create your first environment</Button></div>:<div className="table-scroll"><table><thead><tr><th>Environment</th><th>Status</th><th>Lifetime</th><th>Actions</th></tr></thead><tbody>
            {environments.filter(e=>e.name.includes(query.toLowerCase())).map(e=><tr key={e.name}><td><strong>{e.name}</strong><small>Sample web app · sandbox-{e.name}</small></td><td><Chip size="small" label={status(e)} color={status(e)==='Running'?'success':status(e)==='Provisioning'?'info':'default'} variant="outlined"/></td><td>{now>=e.expires?'Expired':Math.ceil((e.expires-now)/60000)+' min remaining'}</td><td><Button disabled={status(e)!=='Running'} onClick={()=>setPreview(e)}>Preview</Button><Button color="error" onClick={()=>setRemoving(e.name)}>Delete</Button></td></tr>)}
          </tbody></table>{!environments.some(e=>e.name.includes(query.toLowerCase()))&&<p className="no-results">No environments match your search.</p>}</div>}
        </section>
        <div className="footnote"><span>ONE TEMPLATE. ENDLESS POSSIBILITIES.</span><p>Start with a sample web app. APIs, databases, and custom templates come next.</p></div>
      </section>
    </main>
    <Dialog open={creating} onClose={()=>setCreating(false)} fullWidth maxWidth="sm">
      <form onSubmit={e=>{e.preventDefault();create()}}><DialogTitle>Create an environment</DialogTitle><DialogContent>
        <p className="dialog-copy">Give your next experiment a home.</p>
        <TextField autoFocus fullWidth margin="normal" label="Environment name" placeholder="feature-login" value={name} onChange={e=>setName(e.target.value)} error={Boolean(error)} helperText={error||'Used as the sandbox name. Example: feature-login'}/>
        <TextField select fullWidth margin="normal" label="Template" value="web"><MenuItem value="web">Sample web app</MenuItem></TextField>
        <TextField select fullWidth margin="normal" label="Lifetime" value={duration} onChange={e=>setDuration(Number(e.target.value))}>{[1,4,8,24].map(h=><MenuItem key={h} value={h}>{h} hour{h===1?'':'s'}</MenuItem>)}</TextField>
        <Alert severity="info" sx={{mt:2}}>Demo only: readiness is simulated after 3 seconds. Expired environments remain listed until deleted.</Alert>
      </DialogContent><DialogActions><Button onClick={()=>setCreating(false)}>Cancel</Button><Button type="submit" variant="contained" disabled={!valid||duplicate}>Create environment</Button></DialogActions></form>
    </Dialog>
    <Dialog open={removing!==null} onClose={()=>setRemoving(null)}><DialogTitle>Delete {removing}?</DialogTitle><DialogContent>This removes the environment from this demo session.</DialogContent><DialogActions><Button onClick={()=>setRemoving(null)}>Cancel</Button><Button color="error" variant="contained" onClick={()=>{setEnvironments(es=>es.filter(e=>e.name!==removing));setRemoving(null);setNotice('Demo environment deleted.')}}>Delete environment</Button></DialogActions></Dialog>
    <Dialog open={preview!==null} onClose={()=>setPreview(null)} fullWidth><DialogTitle>{preview?.name}</DialogTitle><DialogContent><Alert severity="success">Your simulated sandbox is ready.</Alert><p>A real application URL will appear here once we connect the backend and Kubernetes routing.</p></DialogContent><DialogActions><Button onClick={()=>setPreview(null)}>Close</Button></DialogActions></Dialog>
    {notice&&<div className="notification" role="status"><Alert onClose={()=>setNotice('')} severity="success">{notice}</Alert></div>}
  </div>;
}
