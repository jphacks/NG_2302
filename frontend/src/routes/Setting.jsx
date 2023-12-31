import { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { PageTitle } from '../components/PageTitle';
import { useCookies } from 'react-cookie';
import { QRCodeCanvas } from 'qrcode.react';
import { RegisterModalDialog } from '../components/RegisterModalDialog';
import { ModeStorage } from '../hooks/ModeHook';

export const Setting = () => {
    const [open, setOpen] = useState(false);
    const [cookies] = useCookies(['access_token']);
    const [qrCode, setQrCode] = useState('');
    const modeStorage = new ModeStorage();

    const createQrCode = () => {
        console.log('createQrCode');
        if (cookies.id === undefined || cookies.password === undefined) {
            return;
        }
        const jsonData = {
            id: cookies.id,
            password: cookies.password,
        }

        const jsonDataString = JSON.stringify(jsonData);
        const baseUrl = 'https://dj-hukkin.netlify.app';
        const qrUrl = baseUrl + '/qrAuth/?data=' + encodeURIComponent(jsonDataString);
        console.log(qrUrl);

        setQrCode(qrUrl);
    }

    return (
        <>
            <RegisterModalDialog open={open} setOpen={setOpen} />

            <PageTitle title={'アカウント情報'} />

            <Box sx={{ mt: 1 }} textAlign={'center'} >
                <Typography component="h4" className='text'>
                    ユーザーID
                </Typography>
                <Typography component="h2" variant="div">
                    {cookies.id}
                </Typography>
            </Box>
            <Box sx={{ mt: 1, mb: 3}} textAlign={'center'} >
                <Typography component="h4" className='text'>
                    パスワード
                </Typography>
                <Typography component="h2" variant="div">
                    {cookies.password}
                </Typography>
            </Box>

            {modeStorage.isDjMode()
                ? <>
                    <PageTitle title={'スポティファイ再登録'} />
                    <Button
                        className="Button_white dark"
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={() => setOpen(true)}
                        sx={{ mt: 2, mb: 3 }}
                    >
                        再登録する
                    </Button>
                </>
                : null}

            <PageTitle title={'ユーザーはこちら'} />
            <Button
                className="Button_white dark"
                sx={{ mt: 2, mb: 2 }} onClick={createQrCode}>QRコード生成</Button>
            {qrCode !== '' &&
                <Grid marginTop={4} marginBottom={4} container justifyContent="center">
                    <QRCodeCanvas
                        value={qrCode}
                        size={256}
                    />
                </Grid>}
        </>
    );
}