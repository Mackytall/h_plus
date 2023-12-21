import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';
import ShareIcon from '@mui/icons-material/Share';
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from 'react-share';

export interface IShareProps {
  mainTitle: string;
  url: string;
  title: string;
}

const Share = ({ mainTitle, url, title }: IShareProps) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getLinkToShare = async (link: string) => {
    await navigator.clipboard.writeText(link);
  };

  return (
    <>
      <ShareIcon color="primary" onClick={handleClickOpen} sx={{ cursor: 'pointer' }} />
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{mainTitle}</DialogTitle>
        <DialogContent dividers={true}>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{
              width: '500px',
              height: '50%',
              marginBottom: '2rem',
              [theme.breakpoints.down(500)]: {
                width: '300px',
                height: '50%',
              },
            }}
          >
            <EmailShareButton url={url} subject={title} body="body">
              <EmailIcon
                sx={{ fontSize: '50px', '&:hover': { color: theme.palette.primary.main } }}
              />
            </EmailShareButton>
            <FacebookShareButton url={url} quote={title}>
              <FacebookIcon
                sx={{ fontSize: '50px', '&:hover': { color: theme.palette.primary.main } }}
              />
            </FacebookShareButton>
            <TwitterShareButton url={url} title={title}>
              <TwitterIcon
                sx={{ fontSize: '50px', '&:hover': { color: theme.palette.primary.main } }}
              />
            </TwitterShareButton>
            <LinkedinShareButton url={url}>
              <LinkedInIcon
                sx={{ fontSize: '50px', '&:hover': { color: theme.palette.primary.main } }}
              />
            </LinkedinShareButton>
          </Stack>
          <Paper
            component="form"
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Link href="#" underline="none">
              {url}
            </Link>
            <IconButton
              type="submit"
              sx={{ p: '10px' }}
              aria-label="search"
              onClick={(e) => {
                getLinkToShare(url);

                e.preventDefault();
                handleClose();
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Share;
