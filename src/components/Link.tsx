import { useRouter } from 'next/router';
import type { LinkProps as NextLinkProps } from 'next/link';
import NextLink from 'next/link';
import { styled } from '@mui/material/styles';
import { forwardRef } from 'react';
import type { LinkProps as MuiLinkProps } from '@mui/material';
import { Link as MuiLink } from '@mui/material';

// Add support for the sx prop for consistency with the other branches.
const Anchor = styled('a')({});

interface NextLinkComposedProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    Omit<NextLinkProps, 'href' | 'as' | 'passHref' | 'onMouseEnter' | 'onClick' | 'onTouchStart'> {
  to: NextLinkProps['href'];
  linkAs?: NextLinkProps['as'];
}

const NextLinkComposed = forwardRef<HTMLAnchorElement, NextLinkComposedProps>(
  (props, ref) => {
    const {
      to,
      linkAs,
      replace,
      scroll,
      shallow,
      prefetch,
      legacyBehavior = true,
      locale,
      ...other
    } = props;

    return (
      <NextLink
        href={to}
        prefetch={prefetch}
        as={linkAs}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref
        locale={locale}
        legacyBehavior={legacyBehavior}
      >
        <Anchor ref={ref} {...other} />
      </NextLink>
    );
  },
);

type LinkProps = {
  activeClassName?: string;
  as?: NextLinkProps['as'];
  href: NextLinkProps['href'];
  linkAs?: NextLinkProps['as']; // Useful when the as prop is shallow by styled().
} & Omit<NextLinkComposedProps, 'to' | 'linkAs' | 'href'> &
  Omit<MuiLinkProps, 'href'>;

const resolvePathname = (href: LinkProps['href']) => (
  typeof href === 'string' ? href : href.pathname
);

// A type predicate so the caller keeps the `string` narrowing it needs to pass
// `href` straight to MuiLink.
const isExternalHref = (href: LinkProps['href']): href is string => (
  typeof href === 'string' && (href.startsWith('http') || href.startsWith('mailto:'))
);

const buildClassName = (
  classNameProps: string | undefined,
  isActive: boolean,
  activeClassName: string,
) => `${classNameProps} ${isActive && activeClassName ? activeClassName : ''}`;

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/api-reference/next/link
export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const {
    activeClassName = 'active',
    as,
    className: classNameProps,
    href,
    legacyBehavior,
    linkAs: linkAsProp,
    locale,
    prefetch,
    replace,
    role: _, // Link don't have roles.
    scroll,
    shallow,
    ...other
  } = props;

  const router = useRouter();
  const pathname = resolvePathname(href);
  const className = buildClassName(
    classNameProps,
    router.pathname === pathname,
    activeClassName,
  );

  if (isExternalHref(href)) {
    return <MuiLink className={className} href={href} ref={ref} {...other} />;
  }

  const linkAs = linkAsProp || as;
  const nextjsProps = {
    to: href,
    linkAs,
    replace,
    scroll,
    shallow,
    prefetch,
    legacyBehavior,
    locale,
  };

  return (
    <MuiLink
      component={NextLinkComposed}
      className={className}
      ref={ref}
      {...nextjsProps}
      {...other}
    />
  );
});
