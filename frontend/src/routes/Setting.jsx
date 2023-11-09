import { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { PageTitle } from '../components/PageTitle';
import { useCookies } from 'react-cookie';
import { QRCodeCanvas } from 'qrcode.react';
import { RegisterModalDialog } from '../components/RegisterModalDialog';

export const Setting = () => {
    const [open, setOpen] = useState(false);
    const [cookies] = useCookies(['access_token']);
    const [qrCode, setQrCode] = useState('');

    const createQrCode = () => {
        console.log('createQrCode');
        const jsonData = {
            id: cookies.id,
            password: cookies.password,
        }

        const jsonDataString = JSON.stringify(jsonData);
        let baseUrl = window.location.origin + '/qrAuth';

        // テスト用 これデプロイするたびにバージョン上がってくから何とかしないと
        baseUrl = 'https://deploy-preview-22--loquacious-marigold-435f89.netlify.app';
        // return baseUrl + '/qrAuth?data=' + encodeURIComponent(jsonDataString);
        console.log(baseUrl + '/qrAuth/?data=' + encodeURIComponent(jsonDataString));
        setQrCode(baseUrl + '/qrAuth/?data=' + encodeURIComponent(jsonDataString));
    }

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                width: '100%', // これすると横がフルで表示される
            }}
        >
            <RegisterModalDialog open={open} setOpen={setOpen} />

            <PageTitle title={'アカウント情報'} />

            <Box sx={{ mt: 1 }} >
                <Typography component="h4">
                    ID
                </Typography>
                <Typography component="h2" variant="div">
                    {cookies.id}
                </Typography>
            </Box>
            <Box sx={{ mt: 1, mb: 3 }} >
                <Typography component="h4">
                    パスワード
                </Typography>
                <Typography component="h2" variant="div">
                    {cookies.password}
                </Typography>
            </Box>

            <PageTitle title={'スポティファイ再登録'} />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={() => setOpen(true)}
                sx={{ mt: 2, mb: 3 }}
            >
                再登録する
            </Button>

            <PageTitle title={'ユーザーはこちら'} />
            <Button sx={{ mt: 2, mb: 2 }} onClick={createQrCode}>QRコード生成</Button>
            {
                qrCode !== '' &&
                <Grid container justifyContent="center">
                    <QRCodeCanvas
                        value={qrCode}
                        size={256}
                    />
                </Grid>
            }
        </Box>
    );
}