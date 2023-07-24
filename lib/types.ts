export type User = {
    id: number,
    username: string,
    avatar: string,
}

export type Feed = {
    user: User,
    id: number,
    title: string,
    content: string,
    images: string[],
    publishedAt: Date,
    like_count: number,
    comment_count: number,
    collect_count: number,
    isLiked: boolean,
    created_at_friendly: string,
}

export type PaginationData = {
    items: [],
    meta: {
      totalPages: number,
      total?: number,
      limit?: number,
      nextPage?: number,
      page?: number,
    }
}

export type UserProfileData = {
    id: number;
    username: string;
    avatar: string;
    description: string;
    gender: string;
    interactionInfo: {
        isFollowing: boolean;
        followingCount: number;
        followerCount: number;
        receivedLikeCount: number;
        receivedCollectCount: number;
    }
}
