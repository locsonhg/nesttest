interface SendMailTemplateParams {
  commenterName?: string;
  postTitle?: string;
  commentContent?: string;
  replierName?: string;
  content?: string;
  replyContent?: string;
  commentId?: number;
}

export const renderSendMailAuthorPost = ({
  commenterName,
  postTitle,
  commentContent,
}: SendMailTemplateParams) => {
  return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>New Comment on Your Post!</h2>
            <p><strong>${commenterName}</strong> has commented on your post: <em>${postTitle}</em></p>
            <p><strong>Comment:</strong></p>
            <blockquote style="margin-left: 20px; color: #555;">
                ${commentContent}
            </blockquote>
            <p>Visit your post to view and reply to the comment.</p>
            <p><a href="http://yourwebsite.com/posts/${encodeURIComponent(postTitle)}">Go to your post</a></p>
            <hr>
            <p>This is an automated message, please do not reply.</p>
        </div>
    `;
};

export const renderSendMailCommentReply = ({
  replierName,
  content,
  replyContent,
  commentId,
}: SendMailTemplateParams) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Bình luận của bạn có phản hồi mới!</h2>
      <p><strong>${replierName}</strong> đã trả lời bình luận của bạn:</p>
      <blockquote style="margin-left: 20px; color: #555;">
        "${content}"
      </blockquote>
      <p><strong>Phản hồi:</strong></p>
      <blockquote style="margin-left: 20px; color: #555;">
        ${replyContent}
      </blockquote>
      <p>Truy cập bài viết để xem và trả lời.</p>
      <p><a href="http://yourwebsite.com/comments/${commentId}">Đi đến bình luận của bạn</a></p>
      <hr>
      <p>Đây là một tin nhắn tự động, vui lòng không trả lời.</p>
    </div>
  `;
};

export function renderResetPasswordMail({ otp }: { otp: string }) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #333;">🔒 Yêu cầu đặt lại mật khẩu</h2>
      <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu từ tài khoản của bạn.</p>
      <p>Mã OTP của bạn là:</p>
      <h3 style="font-size: 24px; color: #d9534f; text-align: center;">${otp}</h3>
      <p>Mã này sẽ hết hạn trong <strong>10 phút</strong>. Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
      <hr />
      <p style="font-size: 12px; color: #888;">Đây là email tự động, vui lòng không trả lời.</p>
    </div>
  `;
}
