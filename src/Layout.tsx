import { Box, Container, Typography } from "@mui/material";
import Head from "next/head";
import Link from '@mui/material/Link';
import PrimarySearchAppBar from "./MenuBars";
import SimpleBottomNavigation from "./SimpleBottomNavigation";

interface ILayoutProps {
  children?: any;
  title?: string;
}

function Copyright() {
  return (
    <Typography variant="body2" align="center" className="text-gray-50 space-x-2">
      <span>{'Copyright © '}</span>
      <Link color="inherit" href="https://mui.com/" className="text-gray-300 text-sm">
        goflashdeal
      </Link>{' '}
      {new Date().getFullYear()}
      <span> {'.'}</span>
    </Typography>
  );
}

export default function Layout({ children, title }: ILayoutProps) {
  return (
    <Container style={{ padding: 0 }} maxWidth={false} className="overflow-hidden">
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        {title && <title>{title}</title>}
      </Head>
      <PrimarySearchAppBar />
      <div className="min-h-screen flex flex-col justify-between my-14">
        {children}
      </div>
      <SimpleBottomNavigation />
    </Container>
  );
}
