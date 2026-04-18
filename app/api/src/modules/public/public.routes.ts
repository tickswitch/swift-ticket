import { Router, Request, Response } from 'express';
import prisma from '../../config/prisma';
import catchAsync from '../../utils/catchAsync';
import { errorResponse } from '../../utils/response';
import { z } from 'zod';

const router = Router();

// ========================
// CMS
// ========================
router.get('/cms', catchAsync(async (req: Request, res: Response) => {
  const page = req.query.page as string;
  const section = req.query.section as string;

  if (!page || !section) {
    return errorResponse(res, 'Page and section parameters are required.', 422);
  }

  const cmsData = await prisma.cMS.findFirst({
    where: { page, section, status: 'active' },
  });

  if (!cmsData) return res.json({ status: false, message: 'Data not found', data: null });

  let galleries: any[] = [];
  if (section === 'gallery') {
    galleries = await prisma.gallery.findMany({ where: { cms_id: cmsData.id } });
    galleries = galleries.map(g => ({
      ...g,
      gallery: `${process.env.APP_URL}/uploads/gallery/${g.gallery}`,
    }));
  }

  // Prepend app URL to image/video strings
  const formattedData = {
    ...cmsData,
    image: cmsData.image ? `${process.env.APP_URL}/uploads/cms/${cmsData.image}` : null,
    video: cmsData.video ? `${process.env.APP_URL}/uploads/cms/${cmsData.video}` : null,
  };

  return res.json({ status: true, data: formattedData, galleries });
}));

// ========================
// Dynamic Pages
// ========================
router.get('/dynamic-page/:slug', catchAsync(async (req: Request, res: Response) => {
  const page = await prisma.dynamicPage.findUnique({
    where: { slug: req.params.slug, status: 'active' },
  });
  if (!page) return res.json({ status: false, message: 'Page not found', data: null });
  return res.json({ status: true, data: page });
}));

// ========================
// Contact Us
// ========================
const contactSchema = z.object({
  first_name: z.string().max(255),
  last_name: z.string().max(255).optional(),
  company_name: z.string().max(255),
  company_type: z.string().max(255),
  region: z.string().max(255),
  email: z.string().email(),
  phone: z.string().max(20),
  message: z.string(),
});

router.post('/contact-us', catchAsync(async (req: Request, res: Response) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) return errorResponse(res, parsed.error.errors[0].message, 422);

  await prisma.contact.create({ data: parsed.data });
  return res.json({ status: true, message: 'Message sent successfully.' });
}));

// ========================
// FAQ
// ========================
router.get('/faq', catchAsync(async (req: Request, res: Response) => {
  const type = req.query.type as string;
  const faqs = await prisma.faq.findMany({
    where: type ? { type } : undefined,
    orderBy: { created_at: 'desc' },
    select: { id: true, type: true, question: true },
  });
  return res.json({ success: true, data: faqs });
}));

router.get('/faq/answer/:id', catchAsync(async (req: Request, res: Response) => {
  const faq = await prisma.faq.findUnique({ where: { id: Number(req.params.id) } });
  if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found.' });
  return res.json({ success: true, data: { id: faq.id, type: faq.type, answer: faq.answer } });
}));

// ========================
// Reviews
// ========================
router.get('/reviews', catchAsync(async (_req: Request, res: Response) => {
  const reviews = await prisma.review.findMany({
    include: { user: { select: { id: true, name: true, avatar: true } } },
    orderBy: { created_at: 'desc' },
  });
  const data = reviews.map(r => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    user_name: r.user.name,
    user_avatar: r.user.avatar ? `${process.env.APP_URL}/uploads/${r.user.avatar}` : null,
  }));
  return res.json({ status: true, data });
}));

export default router;
