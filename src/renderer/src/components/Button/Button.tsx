import styles from './Button.module.scss'
import { VariantProps, cva } from 'class-variance-authority'
import clsx from 'clsx'
import { ButtonHTMLAttributes, ForwardedRef, PropsWithChildren, forwardRef } from 'react'
import { Link, LinkProps } from 'react-router-dom'

export const buttonVariants = cva(styles.button, {
    variants: {
        variant: {
            outlined: styles['variant-outlined'],
            contained: styles['variant-contained'],
            text: styles['variant-text']
        }
    },
    defaultVariants: {
        variant: 'contained'
    }
})

type CompBaseProps = VariantProps<typeof buttonVariants> &
    PropsWithChildren<{
        className?: string
    }>

type CompButtonProps = CompBaseProps &
    ButtonHTMLAttributes<HTMLButtonElement> & {
        to?: undefined
    }

type CompLinkProps = CompBaseProps &
    Omit<LinkProps, 'className'> & {
        to: string
    }

export type ButtonProps = CompButtonProps | CompLinkProps

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
    ({ className, children, to, variant, ...restProps }, ref) => {
        const compClassName = clsx(buttonVariants({ variant }), className)
        if (to !== undefined) {
            return (
                <Link
                    ref={ref as ForwardedRef<HTMLAnchorElement>}
                    className={compClassName}
                    to={to}
                    {...(restProps as Omit<CompLinkProps, 'to' | 'className' | 'children'>)}
                >
                    {children}
                </Link>
            )
        } else {
            return (
                <button
                    ref={ref as ForwardedRef<HTMLButtonElement>}
                    className={compClassName}
                    {...(restProps as Omit<CompButtonProps, 'className' | 'children'>)}
                >
                    {children}
                </button>
            )
        }
    }
)

Button.displayName = 'Button'
