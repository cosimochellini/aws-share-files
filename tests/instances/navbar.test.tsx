import { isValidElement } from 'react';
import { describe, expect, it } from 'vitest';

import { Visibility, navbarItems } from '../../src/instances/navbar';

describe('Visibility', () => {
  it('exposes the four placement options', () => {
    expect(Visibility).toEqual({
      All: 'All',
      Sidebar: 'Sidebar',
      BottomBar: 'BottomBar',
      Disabled: 'Disabled',
    });
  });
});

describe('navbarItems', () => {
  it('lists the five entries in navigation order', () => {
    expect(navbarItems.map((item) => ({
      name: item.name,
      redirect: item.redirect,
      visibility: item.visibility,
    }))).toEqual([
      { name: 'Files', redirect: '/files', visibility: Visibility.All },
      { name: 'Upload', redirect: '/upload', visibility: Visibility.All },
      { name: 'Settings', redirect: '/settings', visibility: Visibility.All },
      { name: 'Manage Email', redirect: '/email/manage', visibility: Visibility.Sidebar },
      { name: 'Logout', redirect: '/logout', visibility: Visibility.Sidebar },
    ]);
  });

  it('keeps Manage Email and Logout out of the bottom bar', () => {
    const sidebarOnly = navbarItems
      .filter((item) => item.visibility === Visibility.Sidebar)
      .map((item) => item.name);

    expect(sidebarOnly).toEqual(['Manage Email', 'Logout']);
  });

  it('renders every redirect as an absolute path', () => {
    expect(navbarItems.every((item) => item.redirect.startsWith('/'))).toBe(true);
  });

  it('gives every entry a renderable icon', () => {
    expect(navbarItems.every((item) => isValidElement(item.icon))).toBe(true);
  });

  it('has no duplicate names or redirects', () => {
    expect(new Set(navbarItems.map((item) => item.name)).size).toBe(navbarItems.length);
    expect(new Set(navbarItems.map((item) => item.redirect)).size).toBe(navbarItems.length);
  });
});
