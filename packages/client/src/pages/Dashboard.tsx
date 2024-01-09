import { Typography, Grid } from "@mui/material"

const Dashboard = () => {
    return (
        <Grid sx={{display:"flex", justifyContent:"center", alignItems:"center", height:"80vh", }}>
             <Typography variant="h4" component="p">Dashboard</Typography>
        </Grid>
    )
}

export default Dashboard