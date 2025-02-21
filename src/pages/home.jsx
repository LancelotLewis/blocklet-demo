import DID from '@arcblock/ux/lib/DID';
import InfoRow from '@arcblock/ux/lib/InfoRow';
import Tag from '@arcblock/ux/lib/Tag';
import { CheckoutDonate, DonateProvider, PaymentProvider } from '@blocklet/payment-react';
import { Footer, Header } from '@blocklet/ui-react';
import { Icon } from '@iconify/react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  IconButton,
  Tooltip,
} from '@mui/material';
import { uniqBy } from 'lodash-es';
import { useEffect, useState } from 'react';

import api from '../libs/api';
import { useSessionContext } from '../libs/session';
import { formatToDatetime } from '../libs/utils';

function Home() {
  const { session, connectApi } = useSessionContext();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session.user]);

  const infoRows = [];
  if (user) {
    infoRows.push({ name: 'User Name', value: user.fullName });
    infoRows.push({ name: 'Avatar', value: <Avatar alt="" src={user.avatar} /> });
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
    const { data: apiUser } = await api.get('/api/userinfo');
    setUser({ ...apiUser, callApiAt: new Date() });
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
              session?.user ? (
                <Tooltip title="Refresh userInfo from api">
                  <IconButton aria-label="refresh" onClick={refreshUser}>
                    <Icon icon="mdi-refresh" />
                  </IconButton>
                </Tooltip>
              ) : null
            }
          />
          <CardContent>
            {session?.user ? (
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
            ) : (
              <Button variant="contained" disableElevation onClick={session.login}>
                Login to view user info
              </Button>
            )}
          </CardContent>
          {session?.user ? (
            <CardActions>
              <PaymentProvider session={session} connect={connectApi}>
                <DonateProvider
                  mountLocation="blocklet-demo"
                  description="Donate developer of the blocklet"
                  enableDonate>
                  <CheckoutDonate
                    settings={{
                      target: 'donation-demo',
                      title: 'Donation Demo',
                      description: 'Just a demo for donation',
                      reference: window.location.href,
                      beneficiaries: [
                        {
                          address: window.blocklet.appPid,
                          share: '100',
                        },
                      ],
                    }}
                  />
                </DonateProvider>
              </PaymentProvider>
            </CardActions>
          ) : null}
        </Card>
      </Container>
      <Footer />
    </Box>
  );
}

export default Home;
