import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'https://api.1xbet-payment.com';

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Request failed. Please try again.');
  }

  return data;
}

const formatCurrency = (balanceCents) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format((balanceCents || 0) / 100);

const amountToCents = (value, allowZero = false) => {
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return null;
  const cents = Math.round(Number(value) * 100);
  return Number.isSafeInteger(cents) && (allowZero || cents > 0) ? cents : null;
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [amountInputs, setAmountInputs] = useState({});
  const [newUser, setNewUser] = useState({ userId: '', name: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [creatingUser, setCreatingUser] = useState(false);
  const [savingUserId, setSavingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [userToRemove, setUserToRemove] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    apiRequest('/api/admin/users')
      .then(({ users: accountList }) => {
        if (!active) return;
        setUsers(accountList);
        setAmountInputs(Object.fromEntries(
          accountList.map((account) => [account.userId, '']),
        ));
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');

    if (!/^\d{9}$/.test(newUser.userId.trim())) {
      setError('User ID must contain exactly 9 digits.');
      return;
    }
    if (newUser.name.trim().length > 60) {
      setError('Name must be 60 characters or fewer.');
      return;
    }
    if (newUser.password.length < 12 || newUser.password.length > 128) {
      setError('Password must be 12–128 characters long.');
      return;
    }

    setCreatingUser(true);
    try {
      const { user: createdUser } = await apiRequest('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          ...newUser,
          userId: newUser.userId.trim(),
          name: newUser.name.trim(),
        }),
      });
      setUsers((currentUsers) => [createdUser, ...currentUsers]);
      setAmountInputs((currentInputs) => ({ ...currentInputs, [createdUser.userId]: '' }));
      setNewUser({ userId: '', name: '', password: '' });
      setNotice(`Account ${createdUser.userId} was created.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCreatingUser(false);
    }
  };

  const handleBalanceAction = async (account, action) => {
    setError('');
    const amountCents = amountToCents(amountInputs[account.userId] || '');
    if (amountCents === null) {
      setError('Enter an amount greater than zero with up to 2 decimal places.');
      return;
    }

    setSavingUserId(account.userId);
    try {
      const { user: updatedUser } = await apiRequest(`/api/admin/users/${account.userId}/balance`, {
        method: 'POST',
        body: JSON.stringify({ amountCents, action }),
      });
      setUsers((currentUsers) => currentUsers.map((item) => (
        item.userId === updatedUser.userId ? { ...item, balanceCents: updatedUser.balanceCents } : item
      )));
      setAmountInputs((currentInputs) => ({ ...currentInputs, [account.userId]: '' }));
      setNotice(`${action === 'add' ? 'Added' : 'Deducted'} ${formatCurrency(amountCents)} ${action === 'add' ? 'to' : 'from'} ${account.userId}'s balance.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingUserId(null);
    }
  };

  const handleBalanceSet = async (account) => {
    setError('');
    const balanceCents = amountToCents(amountInputs[account.userId] || '', true);
    if (balanceCents === null) {
      setError('Enter a balance amount with up to 2 decimal places.');
      return;
    }

    setSavingUserId(account.userId);
    try {
      const { user: updatedUser } = await apiRequest(`/api/admin/users/${account.userId}/balance`, {
        method: 'PATCH',
        body: JSON.stringify({ balanceCents }),
      });
      setUsers((currentUsers) => currentUsers.map((item) => (
        item.userId === updatedUser.userId ? { ...item, balanceCents: updatedUser.balanceCents } : item
      )));
      setAmountInputs((currentInputs) => ({ ...currentInputs, [account.userId]: '' }));
      setNotice(`Set ${account.userId}'s balance to ${formatCurrency(balanceCents)}.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingUserId(null);
    }
  };

  const handleRemoveUser = async () => {
    if (!userToRemove) return;
    setError('');
    setDeletingUserId(userToRemove.userId);
    try {
      await apiRequest(`/api/admin/users/${userToRemove.userId}`, { method: 'DELETE' });
      setUsers((currentUsers) => currentUsers.filter((item) => item.userId !== userToRemove.userId));
      setAmountInputs((currentInputs) => {
        const nextInputs = { ...currentInputs };
        delete nextInputs[userToRemove.userId];
        return nextInputs;
      });
      setNotice(`Account ${userToRemove.userId} was removed.`);
      setUserToRemove(null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f4f7fb', py: { xs: 3, md: 6 } }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ color: '#113264', fontWeight: 800 }}>
              Admin dashboard
            </Typography>
            <Typography sx={{ color: '#66788a', mt: 0.5 }}>
              Signed in as {user?.userId}
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        {/* <Alert severity="info" sx={{ mb: 2 }}>
          Add to, deduct from, or set an account balance, or remove a user. Balance changes are stored in this app; no payment is sent or verified here.
        </Alert> */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Paper component="form" onSubmit={handleCreateUser} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 1.5, color: '#113264', fontWeight: 700 }}>
            Create user account
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <TextField
              label="User ID"
              value={newUser.userId}
              onChange={(event) => setNewUser((current) => ({ ...current, userId: event.target.value }))}
              inputProps={{ maxLength: 9, inputMode: 'numeric' }}
              required
            />
            <TextField
              label="Name"
              value={newUser.name}
              onChange={(event) => setNewUser((current) => ({ ...current, name: event.target.value }))}
              inputProps={{ maxLength: 60 }}
            />
            <TextField
              label="Initial password"
              type="password"
              value={newUser.password}
              onChange={(event) => setNewUser((current) => ({ ...current, password: event.target.value }))}
              inputProps={{ minLength: 12, maxLength: 128 }}
              required
            />
            <Button type="submit" variant="contained" disabled={creatingUser} sx={{ whiteSpace: 'nowrap' }}>
              {creatingUser ? 'Creating…' : 'Create account'}
            </Button>
          </Stack>
        </Paper>

        <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#eaf1fa' }}>
                <TableCell sx={{ fontWeight: 700 }}>User ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Current balance</TableCell>
                <TableCell sx={{ fontWeight: 700, minWidth: 145 }}>Amount (USD)</TableCell>
                <TableCell sx={{ fontWeight: 700, minWidth: 255 }}>Balance actions</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Account</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow><TableCell colSpan={6} align="center"><CircularProgress size={24} /></TableCell></TableRow>
              )}
              {!loading && users.length === 0 && (
                <TableRow><TableCell colSpan={6} align="center">No user accounts yet. Create one using the form above.</TableCell></TableRow>
              )}
              {!loading && users.map((account) => (
                <TableRow key={account.userId} hover>
                  <TableCell>{account.userId}</TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{formatCurrency(account.balanceCents)}</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={amountInputs[account.userId] ?? ''}
                      onChange={(event) => setAmountInputs((current) => ({
                        ...current,
                        [account.userId]: event.target.value,
                      }))}
                      inputProps={{ min: 0.01, step: 0.01, 'aria-label': `Amount for ${account.userId}` }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleBalanceAction(account, 'add')}
                        disabled={savingUserId === account.userId || deletingUserId === account.userId}
                      >
                        {savingUserId === account.userId ? 'Saving…' : 'Add'}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        onClick={() => handleBalanceAction(account, 'deduct')}
                        disabled={savingUserId === account.userId || deletingUserId === account.userId}
                      >
                        Deduct
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => handleBalanceSet(account)}
                        disabled={savingUserId === account.userId || deletingUserId === account.userId}
                      >
                        Set
                      </Button>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      startIcon={<PersonRemoveIcon />}
                      onClick={() => setUserToRemove(account)}
                      disabled={savingUserId === account.userId || deletingUserId === account.userId}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Dialog open={Boolean(userToRemove)} onClose={() => deletingUserId || setUserToRemove(null)}>
        <DialogTitle>Remove user account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This permanently removes User ID {userToRemove?.userId}, its current balance ({formatCurrency(userToRemove?.balanceCents)}), its balance history, and its active sessions. The account cannot sign in again unless an administrator creates it again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserToRemove(null)} disabled={Boolean(deletingUserId)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleRemoveUser} disabled={Boolean(deletingUserId)}>
            {deletingUserId ? 'Removing…' : 'Remove account'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(notice)} autoHideDuration={3500} onClose={() => setNotice('')}>
        <Alert severity="success" onClose={() => setNotice('')} sx={{ width: '100%' }}>
          {notice}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;
