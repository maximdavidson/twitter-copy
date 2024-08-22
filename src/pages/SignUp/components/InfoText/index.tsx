import { FC } from 'react';
import s from '@/pages/SignUp/style.module.css';
import { INFO_TEXT } from '@/constants/infoText';

export const InfoText: FC = () => <p className={s.text}>{INFO_TEXT}</p>;
