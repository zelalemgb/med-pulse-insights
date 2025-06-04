import { createServer } from 'node:http';
import { supabaseService, supabaseServer } from '../src/integrations/supabase/serverClient.js';

const PORT = process.env.PORT || 3001;

function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

async function getBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch (err) {
        reject(err);
      }
    });
  });
}

async function authenticate(req) {
  const auth = req.headers['authorization'];
  if (!auth) return null;
  const token = auth.split(' ')[1];
  const { data } = await supabaseServer.auth.getUser(token);
  return data?.user || null;
}

const server = createServer(async (req, res) => {
  if (req.method !== 'POST') {
    json(res, 404, { error: 'Not found' });
    return;
  }

  const user = await authenticate(req);
  if (!user) {
    json(res, 401, { error: 'Unauthorized' });
    return;
  }

  if (req.url === '/api/approve-user') {
    try {
      const { userId, newRole } = await getBody(req);
      const { error } = await supabaseService.rpc('approve_user', {
        _user_id: userId,
        _approved_by: user.id,
        _new_role: newRole,
      });
      if (error) {
        json(res, 500, { error: error.message });
        return;
      }
      json(res, 200, { success: true });
    } catch (err) {
      json(res, 400, { error: 'Invalid request' });
    }
  } else if (req.url === '/api/reject-user') {
    try {
      const { userId, reason } = await getBody(req);
      const { error } = await supabaseService.rpc('reject_user', {
        _user_id: userId,
        _rejected_by: user.id,
        _reason: reason,
      });
      if (error) {
        json(res, 500, { error: error.message });
        return;
      }
      json(res, 200, { success: true });
    } catch {
      json(res, 400, { error: 'Invalid request' });
    }
  } else if (req.url === '/api/change-user-role') {
    try {
      const { userId, newRole, reason } = await getBody(req);
      const { error } = await supabaseService.rpc('change_user_role', {
        _user_id: userId,
        _changed_by: user.id,
        _new_role: newRole,
        _reason: reason,
      });
      if (error) {
        json(res, 500, { error: error.message });
        return;
      }
      json(res, 200, { success: true });
    } catch {
      json(res, 400, { error: 'Invalid request' });
    }
  } else {
    json(res, 404, { error: 'Not found' });
  }
});

server.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});
