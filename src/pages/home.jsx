import DID from '@arcblock/ux/lib/DID';
import InfoRow from '@arcblock/ux/lib/InfoRow';
import Tag from '@arcblock/ux/lib/Tag';
import { Footer, Header } from '@blocklet/ui-react';
import { Avatar, Box, Container } from '@mui/material';
import { uniqBy } from 'lodash-es';

import { useSessionContext } from '../libs/session';
import { formatToDatetime } from '../libs/utils';

function Home() {
  const { session } = useSessionContext();
  let rows = [];
  if (session?.user) {
    rows.push({ name: 'User Name', value: session.user.fullName });
    rows.push({ name: 'Avatar', value: <Avatar alt="" src={session.user.avatar}></Avatar> });
    rows.push({
      name: 'DID',
      value: <DID did={session.user.did} showQrcode locale="zh" />,
    });
    rows.push({ name: 'Email', value: session.user.email });
    rows.push({
      name: 'Passports',
      value: session.user.passports ? (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {uniqBy(session.user.passports, 'name').map((passport) => (
            <Tag key={passport.name} type={passport.name === 'owner' ? 'success' : 'primary'}>
              {passport.title}
            </Tag>
          ))}
        </Box>
      ) : (
        '--'
      ),
    });
    rows.push({
      name: 'Role',
      value: <Tag type={session.user.role === 'owner' ? 'success' : 'primary'}>{session.user.role}</Tag>,
    });
    rows.push({
      name: 'Last Login',
      value: formatToDatetime(session.user.updatedAt, { locale: 'en' }),
    });
    rows.push({
      name: 'Created At',
      value: formatToDatetime(session.user.createdAt, { locale: 'en' }),
    });
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
      <Header />
      <Container sx={{ flex: 1, py: 4 }}>
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
          {rows.map((row) => {
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
      </Container>
      <Footer />
    </Box>
  );
}

export default Home;
