import React from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

const DialogComponent = (props) => {
    const handleCancel = () => {
        props.onReceiveData({
            visible: false,
            delete: false,
        })
    }

    const handleAccess = () => {
        props.onReceiveData({
            visible: false,
            delete: true,
            user: props.user,
            comment:props.comment
        })
    }
  return (
    <div>
      <Dialog
        open={props.visible}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontSize:30}}>
          {"Xóa bình luận?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ fontSize:20}}>
            Bạn có chắc muốn xóa bình luận ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={{ fontSize:20}} onClick={handleCancel}>HỦY</Button>
          <Button sx={{ fontSize:20}} onClick={handleAccess} autoFocus>
            XÓA
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default DialogComponent