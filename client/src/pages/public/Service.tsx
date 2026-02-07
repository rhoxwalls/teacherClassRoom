// src/pages/public/Servicios.tsx
import { Grid, Card, CardContent, Typography, CardMedia, Button, Box } from '@mui/material';

const SERVICES = [
  { title: 'Clases Grupales', desc: 'Aprende con otros en sesiones interactivas.' },
  { title: 'Tutoría 1-a-1', desc: 'Enfoque personalizado para tus necesidades.' },
  { title: 'Preparación Exámenes', desc: 'IELTS, TOEFL y certificaciones Cambridge.' },
];

const Service = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Nuestros Servicios Educativos
      </Typography>
      <Grid container spacing={3}>
        {SERVICES.map((service, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" color="primary" gutterBottom>
                  {service.title}
                </Typography>
                <Typography color="text.secondary">
                  {service.desc}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button fullWidth variant="outlined">Saber más</Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Service;