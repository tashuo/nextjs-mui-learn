'use client';

import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../src/Layout";
import { Paper } from "@mui/material";

export default function UserProfile({profile}) {
  console.log(1);
  console.log(profile);
  return (
    <Layout title="Community">
      <Paper>
        Welcome to user
      </Paper>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  console.log(params);
  return {
    props: {
      profile: {
        id: params?.userId,
        nickname: 'test'
      }
    }
  }
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
      paths: [], //indicates that no page needs be created at build time
      fallback: 'blocking' //indicates the type of fallback
  }
}
