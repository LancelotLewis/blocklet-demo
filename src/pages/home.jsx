import DID from '@arcblock/ux/lib/DID';
import InfoRow from '@arcblock/ux/lib/InfoRow';
import Tag from '@arcblock/ux/lib/Tag';
import { Footer, Header } from '@blocklet/ui-react';
import { Icon } from '@iconify/react';
import { Avatar, Box, Card, CardContent, CardHeader, Container, IconButton, Tooltip } from '@mui/material';
import { uniqBy } from 'lodash-es';
import { useEffect, useState } from 'react';

import api from '../libs/api';
import { useSessionContext } from '../libs/session';
import { formatToDatetime } from '../libs/utils';

function Home() {
  const { session } = useSessionContext();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(session.user);
  }, []);

  let infoRows = [];
  if (user) {
    infoRows.push({ name: 'User Name', value: user.fullName });
    infoRows.push({ name: 'Avatar', value: <Avatar alt="" src={user.avatar}></Avatar> });
    infoRows.push({
      name: 'DID',
      value: <DID did={user.did} showQrcode locale="zh" />,
    });
    infoRows.push({ name: 'Email', value: user.email });
    infoRows.push({
      name: 'Passports',
      value: user.passports ? (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {uniqBy(user.passports, 'name').map((passport) => (
            <Tag key={passport.name} type={passport.name === 'owner' ? 'success' : 'primary'}>
              {passport.title}
            </Tag>
          ))}
        </Box>
      ) : (
        '--'
      ),
    });
    infoRows.push({
      name: 'Role',
      value: <Tag type={user.role === 'owner' ? 'success' : 'primary'}>{user.role}</Tag>,
    });
    infoRows.push({
      name: 'Last Login',
      value: formatToDatetime(user.updatedAt),
    });
    infoRows.push({
      name: 'Created At',
      value: formatToDatetime(user.createdAt),
    });
    if (user.callApiAt) {
      infoRows.push({
        name: 'Call API At',
        value: formatToDatetime(user.callApiAt),
      });
    }
  }

  const refreshUser = async () => {
    const { data: user } = await api.get('/api/userinfo');
    setUser({ ...user, callApiAt: new Date() });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
      <Header />
      <Container sx={{ flex: 1, py: 4 }}>
        <Card variant="outlined">
          <CardHeader
            title="User info from session"
            action={
              <Tooltip title="Refresh userInfo from api">
                <IconButton aria-label="refresh" onClick={refreshUser}>
                  <Icon icon="mdi-refresh" />
                </IconButton>
              </Tooltip>
            }
          />
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                '&>div': {
                  mb: 0,
                },
                '.info-row__name': {
                  fontWeight: 'bold',
                  color: 'grey.800',
                },
              }}>
              {infoRows.map((row) => {
                if (row.name === 'DID') {
                  return (
                    <InfoRow
                      valueComponent="div"
                      key={row.name}
                      nameWidth={120}
                      name={row.name}
                      nameFormatter={() => 'DID'}>
                      {row.value}
                    </InfoRow>
                  );
                }

                return (
                  <InfoRow valueComponent="div" key={row.name} nameWidth={120} name={row.name}>
                    {row.value}
                  </InfoRow>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </Box>
  );
}

export default Home;
